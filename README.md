# ImmutableType.ts

Convert interface defintions into immutable TypeScript classes, with fully typesafe helper functions for data manipulation.

## Current Status

Basic interface to readonly interface conversion works. No helper methods are yet created and not all fields are safe yet (see the array in `children` for example). 

In:

```ts
export interface Person {
  name: string;
  spouse: Person | null;
  children: Person[];
  shoe_size: 7 | 8 | 9 | 10 | 11 | 12;
  race: "human";
}
```

Out:

```ts
export interface Person {
  readonly name: string;
  readonly spouse: Person | null;
  readonly children: Person[];
  readonly shoe_size: 7 | 8 | 9 | 10 | 11 | 12;
  readonly race: "human";
}
```

## Goal

In:

```ts
interface Person extends ImmutableType {
  name: string;
  spouse: Person | null;
  children: Person[];
}
```

Out: (to be refined, see TODO.md)

```ts
interface Person {
  // TODO: constructors from POCOs and JSON strings
  readonly name: string;
  readonly spouse: Person | null;
  readonly children: ImmutableArray<Person>;

  // TODO: Helper functions to manipulate the data
}
```