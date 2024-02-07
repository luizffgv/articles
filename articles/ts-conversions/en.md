# Conversions in TypeScript with ts-conversions

Although TypeScript provides extensive type safety, sometimes you have to repeat
the same boilerplate code over and over in order satisfy the type checker. The
[@luizffgv/ts-conversions](https://www.npmjs.com/package/@luizffgv/ts-conversions)
NPM package was created to provide simple functions that make working with
TypeScript a quicker and more comfortable experience. Here we will take a look
at the package's few functions.

## The `uncheckedCast` function

It's not uncommon for TypeScript code to be riddled with unsafe type assertions;
although it's desirable to reduce such occurrences to a minimum, there may still
be some left. That's why `uncheckedCast` exists.

`uncheckedCast` is intended to replace the `as` keyword. Here is one way of
using `uncheckedCast` to assert the tag type of a queried HTML element, with the
target type specified as a type argument.

```ts
// type: HTMLElement | null
const input = document.getElementById("input");

// type: HTMLInputElement
const input2 = uncheckedCast<HTMLInputElement>(input);
```

Not only can `uncheckedCast` be used to assert a manually specified type, the
type can also be inferred by omitting the type argument.

```ts
function printValue(element: HTMLInputElement) {
  console.log(element.value);
}

// type: HTMLElement | null
const input = document.getElementById("input");

// Here uncheckedCast has its type parameter inferred as HTMLInputElement
// because of the `printValue` function signature.
printValue(uncheckedCast(input));
```

Occurrences of `uncheckedCast` can be easily found in code and they also look
ugly, as code smells should.

## The `trySpecify` function

`uncheckedCast` doesn't provide any kind of type checking, so it should be used
sparingly. A safe alternative to `uncheckedCast` is `trySpecify`, which refines
types down the inheritance tree.

`trySpecify` takes a value and a constructor, then returns the value with its
type further refined as the constructor's class type. If the value is not an
instance of that type, the function throws.

```ts
// type: HTMLElement | null
const input = document.getElementById("input");

// type: HTMLInputElement
const refined = trySpecify(input, HTMLInputElement);
```

The return type of a `trySpecify` call is `never` if, from a type-checking
standpoint, the call is guaranteed to throw. This happens when you try to refine
a value to a type that's not part of its inheritance tree.

```ts
// type: HTMLElement | null
const input = document.getElementById("input");

// type: never
const refined = trySpecify(input, Number);
```

## The `throwIfNull` function

It's pretty common to throw if a required value is nullish. `throwIfNull` simply
provides a one-liner for doing just that.

```ts
// type: HTMLElement | null
const input = document.getElementById("input");

// type: HTMLElement
const input2 = throwIfNull(input);
```

The function name is slightly misleading, as it also throws then the value is
`undefined`.

```ts
const map = new Map<number, number>();

// type: number | undefined
const number = map.get(0);

// type: number
const number2 = throwIfNull(number);
```

## Wrapping things up

These functions might not seem like a lot but I began using them in most of my
projects. They are simple, easily adaptable and work with JavaScript. Even
though you may not want to use that package, I strongly suggest you to create
functions with JSDoc or TypeScript to better deal with common type
transformations.
