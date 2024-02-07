# Use arrays instead of type unions

In TypeScript it's common to use type unions of literal types. As an example, I
will model the list of evidence from the game Phasmophobia. In Phasmophobia we
hunt for ghosts and collect evidence to determine the type of a ghost.

```ts
type Evidence =
  | "D.O.T.S Projector"
  | "EMF Level 5"
  | "Freezing Temperatures"
  | "Ghost Orb"
  | "Ghost Writing"
  | "Spirit Box"
  | "Ultraviolet";
```

In this case TypeScript is useful because we can type check the evidence names.
Suppose you want to make a function that checks if a specific evidence has been
found.

```ts
function checkEvidence(evidence) {
  /* ... */
}
```

Without type annotations it's easy to mistype the name of an evidence, and
nothing will warn you of the mistake. We can leverage TypeScript by requiring
the `evidence` parameter to match the `Evidence` type union.

```ts
function checkEvidence(evidence: Evidence) {
  /* ... */
}
```

Now, passing a mistyped argument will cause an error:

```ts
// Error: Argument of type "Frzeing Trmpratures" is not assignable to parameter
//        of type "Evidence".
checkEvidence("Frzeing Trmpratures");
```

Although the type safety is useful, there's more we can do. You can't iterate
over the values of a type union, so if you wanted to check for each evidence
you'd have to retype all of them.

```ts
for (const evidence of [
  "D.O.T.S Projector",
  "EMF Level 5",
  "Freezing Temperatures",
  "Ghost Orb",
  "Ghost Writing",
  "Spirit Box",
  "Ultraviolet",
] as const)
  checkEvidence(evidence);
```

While the above code is type safe, it's not so maintainable. If an evidence is
added or modified, you'd have to change both the type union and the `for` loop.
You may think that enums quickly come to the rescue, but iterating over an enum
produces plain `string`s, and from a type checking perspective, a `string` isn't
assignable to the `evidence` parameter.

```ts
enum Evidence {
  DOTS_Projector,
  EMF_Level_5,
  Freezing_Temperatures,
  Ghost_Orb,
  Ghost_Writing,
  Spirit_Box,
  Ultraviolet,
}

function checkEvidence(evidence: Evidence) {
  /* ... */
}

// Error: Argument of type 'string' is not assignable to parameter of type
//        'Evidence'.
for (const evidence in Evidence) checkEvidence(evidence);
```

In order to avoid all these problems, instead of using a type union or an enum,
I use arrays:

```ts
const Evidence = [
  "D.O.T.S Projector",
  "EMF Level 5",
  "Freezing Temperatures",
  "Ghost Orb",
  "Ghost Writing",
  "Spirit Box",
  "Ultraviolet",
] as const;

type Evidence = (typeof Evidence)[number];

function checkEvidence(evidence: Evidence) {
  /* ... */
}

for (const evidence of Evidence) checkEvidence(evidence);
```

In the code above we determine the `Evidence` type union by the values of the
array with the same name. Sharing an identifier between an array and a type is
not a problem, as TypeScript will determine which entity `Evidence` refers to
depending on the context it is used in. We also use the `as const` assertion to
prevent our evidence literals' types from being widened to `string`.

I encourage everyone to replace hardcoded literal type unions by unions inferred
from arrays. You may not have an immediate reason to iterate over all values of
a type, but someone using you code might.
