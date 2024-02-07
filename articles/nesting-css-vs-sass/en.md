# & selector in CSS vs. Sass

As of writing this, CSS nesting is already
[supported](https://caniuse.com/css-nesting) for the majority of users; this
includes the `&` nesting selector, which has been available for a while in CSS
preprocessors like Sass. Although nesting behaves roughly the same in both CSS
and Sass, I recently ran into a difference that caught me off guard.

## The & selector

The `&` selector is used in nested style rules; in Sass specifically it is
replaced by the parent selectors of that nested style rule. Here's an example
Sass code and its CSS output.

```sass
/* Sass */
#b {
  #c {
    #a & {
      color: red;
    }
  }
}
```

```css
/* CSS output */
#a #b #c {
  color: red;
}
```

As you can see, `&` was replaced by the parent selectors `#b` then `#c`, and
then the rule was extracted to the top level. In CSS, `&` will produce a
different result.

```css
/* CSS */
#b {
  #c {
    #a & {
      color: red;
    }
  }
}
```

```css
/* Equivalent CSS */
#a :is(#b #c) {
  color: red;
}
```

The difference between `#a #b #c` and `#a :is(#b #c)` is as follows.

| Selector        | Match                                                                 |
| --------------- | --------------------------------------------------------------------- |
| `#a #b #c`      | Any `#c` descendant of a `#b` that's, in turn, descendant of an `#a`. |
| `#a :is(#b #c)` | Any `#c` descendant of both an `#a` and a `#b`.                       |

The behavior of the second selector can be broken down into two steps. Suppose
we have an element we'll call `X`; when determining if it matches
`#a :is(#b #c)`, the process unfolds as follows.

- Step 1: Verify if `X` matches the pattern `#b #c`. If it does, move on to the
  next step.
- Step 2: Confirm if `X` matches the pattern `#a X`.

To illustrate this process, consider the following HTML and the corresponding
steps for clarity.

```html
<div id="b">
  <div id="a">
    <!-- 👇 Element X -->
    <div id="c"></div>
  </div>
</div>
```

- Step 1: Does `X` match `#b #c`?

  Yes. `X` has ID `c` and is a descendant of `#b`.

- Step 2: Does `X` match `#a X`?

  Yes. `X` is `X` and is a descendant of `#a`.

- It's a match!

## A real-world example

Suppose you want to make the HTML for a blog post. In our case, the post will be
represented by a `.post` element, and it will contain a highlighted `.summary`.

```html
<div class="post">
  <div class="summary">
    <p class="text">Pigeons are not what you think.</p>
  </div>
  <p class="text">Pigeons are drones made by the Government.</p>
</div>
```

Now let's highlight the summary text with CSS.

```css
.post {
  .text {
    .summary & {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}
```

The CSS selectors above translate to `.summary :is(.post .text)`, and the
summary is properly styled. When you use the exact same code in Sass, the
resulting selector is `.summary .post .text`, which doesn't match the `.text`
element because our `.post` is not a child of `.summary`.

## Wrapping up

Although subtle, the disparity between CSS and Sass in regards to `&` might
cause a lot of confusion and headache. There's a
[Sass GitHub issue](https://github.com/sass/sass/issues/3030) regarding this and
maybe one day `&` will be treated equally, but for now, you have to be mindful
of whether you're using plain CSS or not.
