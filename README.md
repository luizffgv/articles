# Articles

![Test status badge](https://github.com/luizffgv/articles/actions/workflows/test.yml/badge.svg)

This is a repository for some articles/posts I wrote.

You should probably not read the articles directly from here, this repository is
meant to be used to automatically populate a blog or similar.

## Articles organization

Articles are located each under a directory (in kebab-case) in the `articles`
directory. Each article directory contains:

- Associated metadata in the `data.json`. This file must conform to
  [this schema](article-data.schema.json).
- 1 or more Markdown files with the article's contents. Each file represents a
  language that article is available in. The filename must follow the following
  ABNF:

  ```abnf
  filename = 2*3ALPHA     ; Language's shortest ISO 639 code
             ["-" 2ALPHA] ; Region's ISO 3166-1 alpha-2 code
             ".md"
  ```

## Node scripts

- `test`: Checks for errors in the organization of the articles and their
  metadata.
- `lint`: Runs ESLint on Node scripts.
- `type-check`: Type-checks Node scripts using TypeScript.
