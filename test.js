import { readdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { ValidationError, Validator } from "jsonschema";
import ARTICLE_DATA_SCHEMA from "./article-data.schema.json" assert { type: "json" };
import path from "node:path";

const ARTICLES_DIR = "articles";

// Hardcoding this is ugly as hell, have to maintain both this and the schema.
/**
 * @typedef {object} ArticleMetadata Metadata for an article.
 * @property {string[]} tags - Article tags.
 */

/**
 * Validates an article's metadata.
 * @param {unknown} data - Data object to validate.
 * @returns {ArticleMetadata} Article metadata but with the correct type for
 * type checking.
 * @throws {import("jsonschema").ValidationError} Validation failed.
 */
function validateData(data) {
  new Validator().validate(data, ARTICLE_DATA_SCHEMA, {
    throwError: true,
  });

  return /** @type {ArticleMetadata} */ (data);
}

/**
 * Validates an article.
 * @param {string} article - Name of the article folder.
 * @throws Validation failed.
 */
async function validateArticle(article) {
  const articlePath = path.join(ARTICLES_DIR, article);

  const files = await readdir(articlePath);

  const mdFiles = files.filter((file) => path.extname(file) == ".md");

  if (mdFiles.length === 0)
    throw new Error(`Article ${article} has no markdown files.`);

  const wrongMdFilename = mdFiles.find(
    (file) => !/^[a-z]{2,3}(-[A-Z]{2})?\.md$/.test(file)
  );

  if (wrongMdFilename != undefined)
    throw new Error(
      `${wrongMdFilename} in ${article} doesn't conform to the ABNF. Check README.`
    );

  const dataPath = path.join(articlePath, "data.json");

  const dataUTF8 = await readFile(dataPath, "utf8").catch((error) => {
    throw new Error(`Couldn't read data from ${article}: ${error}.`);
  });

  try {
    validateData(JSON.parse(dataUTF8));
  } catch (error) {
    const errorMessage =
      error instanceof ValidationError ? error.message : String(error);

    throw new Error(`Invalid data.json in ${article}: ${errorMessage}`);
  }
}

const articles = await readdir(ARTICLES_DIR);

await Promise.all(articles.map((article) => validateArticle(article)));

console.log("All articles were validated successfully.");
