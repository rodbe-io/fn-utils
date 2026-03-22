# @rodbe/fn-utils

A collection of TypeScript utility functions for functional programming, async handling, array/object manipulation, and HTTP fetching.

## Installation

```bash
npm install @rodbe/fn-utils
# or
pnpm add @rodbe/fn-utils
```

## API Reference

- [Array](#array)
  - [purge](#purge)
  - [unique](#unique)
- [Async](#async)
  - [to](#to)
- [Functional Programming](#functional-programming)
  - [pipe](#pipe)
  - [compose](#compose)
- [Object](#object)
  - [getProp](#getprop)
  - [fuzzySearch](#fuzzysearch)
- [Predicates](#predicates)
  - [hasValue](#hasvalue)
  - [isObject](#isobject)
  - [isEmptyObj](#isemptyobj)
- [Try-Catch](#try-catch)
  - [tryCatch](#trycatch)
- [Fetcher](#fetcher)
  - [fetcher](#fetcher-1)
  - [retryFetchBuilder](#retryfetchbuilder)

---

## Array

### `purge`

Removes all falsy values (`null`, `undefined`, `NaN`, `''`) from an array.

```ts
import { purge } from '@rodbe/fn-utils';

purge([1, null, 'hello', undefined, '', NaN, 2]);
// → [1, 'hello', 2]

purge([null, undefined]);
// → []
```

### `unique`

Returns a new array with duplicate values removed.

```ts
import { unique } from '@rodbe/fn-utils';

unique([1, 2, 2, 3, 1]);
// → [1, 2, 3]

unique(['a', 'b', 'a', 'c']);
// → ['a', 'b', 'c']
```

---

## Async

### `to`

Wraps a Promise into a `[error, result]` tuple — no more try/catch blocks. Returns `[null, result]` on success and `[error, null]` on failure.

Optionally accepts a `customErrorObj` to extend the error with extra properties.

```ts
import { to } from '@rodbe/fn-utils';

// Basic usage
const [err, user] = await to(fetchUser(1));
if (err) {
  console.error('Failed to fetch user:', err);
} else {
  console.log(user);
}

// With custom error properties
const [err, data] = await to(fetchData(), { context: 'dashboard', retryable: true });
if (err) {
  console.log(err.context);    // 'dashboard'
  console.log(err.retryable);  // true
}
```

**Type:**

```ts
type ToAwaited<Res, Err = Error> = [Err, null] | [null, Res];
```

---

## Functional Programming

### `pipe`

Composes functions left-to-right. The output of each function is passed as input to the next.

```ts
import { pipe } from '@rodbe/fn-utils';

const add1 = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toString = (x: number) => `Value: ${x}`;

const transform = pipe(add1, double, toString);
transform(3);
// → 'Value: 8'  (3+1=4, 4*2=8, 'Value: 8')
```

### `compose`

Composes functions right-to-left. The output of each function is passed as input to the previous.

```ts
import { compose } from '@rodbe/fn-utils';

const add1 = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toString = (x: number) => `Value: ${x}`;

const transform = compose(toString, double, add1);
transform(3);
// → 'Value: 8'  (add1 → double → toString)
```

---

## Object

### `getProp`

Curried accessor for deeply nested object properties using dot notation.

```ts
import { getProp } from '@rodbe/fn-utils';

const user = { profile: { name: 'Alice', address: { city: 'NYC' } } };

getProp('profile.name')(user);
// → 'Alice'

getProp<string>('profile.address.city')(user);
// → 'NYC'

// Works great as a mapper
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];
users.map(getProp('name'));
// → ['Alice', 'Bob']
```

### `fuzzySearch`

Filters an array of objects by matching a search string against a given key (supports dot notation). Each word in `searchText` is matched independently (AND logic).

```ts
import { fuzzySearch } from '@rodbe/fn-utils';

const users = [
  { name: 'Alice Smith', role: 'admin' },
  { name: 'Bob Johnson', role: 'user' },
  { name: 'Alice Brown', role: 'user' },
];

fuzzySearch({ items: users, key: 'name', searchText: 'alice' });
// → [{ name: 'Alice Smith', ... }, { name: 'Alice Brown', ... }]

// Multi-word: all words must match
fuzzySearch({ items: users, key: 'name', searchText: 'alice smith' });
// → [{ name: 'Alice Smith', ... }]

// Nested key via dot notation
const products = [{ meta: { title: 'Laptop Pro' } }, { meta: { title: 'Mouse' } }];
fuzzySearch({ items: products, key: 'meta.title', searchText: 'laptop' });
// → [{ meta: { title: 'Laptop Pro' } }]
```

---

## Predicates

### `hasValue`

Returns `true` if the value is not `null`, `undefined`, `NaN`, or `''`.

```ts
import { hasValue } from '@rodbe/fn-utils';

hasValue('hello');    // → true
hasValue(0);          // → true
hasValue(false);      // → true

hasValue(null);       // → false
hasValue(undefined);  // → false
hasValue(NaN);        // → false
hasValue('');         // → false
```

### `isObject`

Returns `true` if the value is a plain object `{}`.

```ts
import { isObject } from '@rodbe/fn-utils';

isObject({ a: 1 });     // → true
isObject({});           // → true

isObject([1, 2]);       // → false
isObject(null);         // → false
isObject('string');     // → false
isObject(new Date());   // → false
```

### `isEmptyObj`

Returns `true` if the value is not a plain object or if it is an object with no own keys.

```ts
import { isEmptyObj } from '@rodbe/fn-utils';

isEmptyObj({});          // → true
isEmptyObj(null);        // → true
isEmptyObj([]);          // → true

isEmptyObj({ a: 1 });   // → false
```

---

## Try-Catch

### `tryCatch`

Wraps a synchronous function in a `[error, result]` tuple — the sync equivalent of [`to`](#to).

```ts
import { tryCatch } from '@rodbe/fn-utils';

const [err, result] = tryCatch(() => JSON.parse('{"ok":true}'));
if (err) {
  console.error(err);
} else {
  console.log(result); // → { ok: true }
}

// Catches thrown errors
const [parseErr] = tryCatch(() => JSON.parse('invalid json'));
console.log(parseErr instanceof Error); // → true
```

---

## Fetcher

### `fetcher`

A thin fetch wrapper that returns a `[error, data]` tuple instead of throwing. HTTP errors (non-2xx) are returned as `FetchErr`, network errors as `Error`.

```ts
import { fetcher } from '@rodbe/fn-utils';

interface User {
  id: number;
  name: string;
}

const [err, user] = await fetcher<User>('https://api.example.com/users/1', {
  method: 'GET',
  headers: { Authorization: 'Bearer token' },
});

if (err) {
  if ('status' in err) {
    // HTTP error
    console.log(err.status);     // e.g. 404
    console.log(err.statusText); // e.g. 'Not Found'
  } else {
    // Network/parse error
    console.error(err.message);
  }
} else {
  console.log(user.name);
}
```

**Types:**

```ts
interface FetchErr {
  status: number;
  statusText: string;
}
```

### `retryFetchBuilder`

Factory that builds a fetch function with automatic retry logic. Retries on configurable HTTP status codes with a delay between attempts.

**Default config:** 3 retries, 1500ms delay, retries on `429`, `503`, `504`.

```ts
import { retryFetchBuilder } from '@rodbe/fn-utils';

// Using defaults (3 retries, 1500ms delay, statuses 429/503/504)
const fetchWithRetry = retryFetchBuilder();

const [err, data] = await fetchWithRetry<{ items: string[] }>(
  'https://api.example.com/items',
  { method: 'GET' }
);

// Custom config
const aggressiveRetry = retryFetchBuilder({
  retries: 5,
  retryDelay: 500,
  statusToRetry: [429, 500, 502, 503, 504],
});

const [err2, data2] = await aggressiveRetry<{ items: string[] }>(
  'https://api.example.com/items',
  { method: 'GET' }
);
```

**Types:**

```ts
interface FetcherConfig {
  retries: number;
  retryDelay: number;
  statusToRetry: Array<number>;
}
```

---

## License

MIT
