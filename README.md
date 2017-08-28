uuid-with-v6 [![Build Status](https://travis-ci.org/kurttheviking/uuid-with-v6-js.svg?branch=master)](https://travis-ci.org/kurttheviking/uuid-with-v6-js) [![Coverage Status](https://coveralls.io/repos/github/kurttheviking/uuid-with-v6-js/badge.svg?branch=master)](https://coveralls.io/github/kurttheviking/uuid-with-v6-js?branch=master)
============

UUID Version 6 for Node.js


## Getting started

### Prerequisites

Node.js 4.x (LTS) is required.

### Install

Install with [npm](https://www.npmjs.com):

```sh
npm install --save uuid-with-v6
```

### Use

```js
const uuid = require('uuid-with-v6');

console.log(uuid.v6());
```


## API

This module extends `uuid` and is intended to serve as a drop-in replacement with added "Version 6" functionality.

### `uuid#v1`

See the [`uuid` documentation](https://github.com/kelektiv/node-uuid/tree/72fbabbf00192817bdce7073e323361f5e7bdd67#version-3).

### `uuid#v4`

See the [`uuid` documentation](https://github.com/kelektiv/node-uuid/tree/72fbabbf00192817bdce7073e323361f5e7bdd67#version-4).

### `uuid#v5`

See the [`uuid` documentation](https://github.com/kelektiv/node-uuid/tree/72fbabbf00192817bdce7073e323361f5e7bdd67#version-5).

### `uuid#v6`

#### Definition

`uuid.v6()`

#### Parameters

*None*

#### Returns

A UUIDv6 `String`.

#### Example

```js
const uuid = require('uuid-with-v6');

console.log(uuid.v6());
// 1e7126af-f130-6780-adb4-8bbe7368fc2f
```

### `uuid#v6setup`

#### Definition

`uuid.v6setup([options])`

#### Parameters

**`options` parameters**

| Parameter | Type | Description | Default |
| :-------- | :--- | :---------- | :------ |
| `disableRandom` | `Boolean` | Disable the use of UUIDv4 to populate the non-timestamp portion of the identifier | `false` |

#### Returns

A UUIDv6 id generator.

#### Example

```js
const uuid = require('uuid-with-v6');

const v6 = uuid.v6setup();

console.log(v6());
// 1e7126af-f130-6780-adb4-8bbe7368fc2f

const v6WithMAC = uuid.v6setup({ disableRandom: true });

console.log(v6WithMAC());
// '1e7126cb-6914-60b0-8c07-8a41b327fae3'
```


## Why

Inspired by [UUID "Version 6", *The version RFC 4122 forgot*](https://bradleypeabody.github.io/uuidv6/), this module extends [uuid](https://www.npmjs.com/package/uuid) by adding the ability to generate UUIDv6 identifiers.

"Version 6" UUIDs arrange the timestamp from high to low bytes (with some bit-shifting to account for the version parameter) resulting in identifiers where lexicographic sorting yields time-based sorting. The non-timestamp portion of the UUID is filled with random bits (similar to Version 4); consequently, ids generated within the same clock tick are not guaranteed to be lexicographically sorted into time-based order.

Internally, this module implements the "Version 6" specification by first creating a UUIDv1, rearranging the timestamp, then generating eight cryptographically-strong bytes to populate the remaining portion of the identifier. Similar to Version 1, clock sequence and MAC address information can be retained by constructing a UUIDv6 generator with the `disableRandom` option (see the example below).

### UUIDv1 versus UUIDv6

Below are 20 UUIDv1 ids and the corresponding UUIDv6 ids generated at 30 second intervals. Note the critical differences:

- The "high" portion of the timestamp is at the beginning, followed by the "medium" and "low"
- The 15th character (version number) is a `6`, rather than a `1`
- Each UUIDv6 identifier ends with cryptographically-strong randomness

```
UUIDv1                               UUIDv6
------------------------------------ ------------------------------------
5714f720-1268-11e7-a24b-96d95aa38c32 1e712685-714f-6720-a23a-c90103f70be6
68f820c0-1268-11e7-a24b-96d95aa38c32 1e712686-8f82-60c0-ac07-7d6641ed230d
7ada38f0-1268-11e7-a24b-96d95aa38c32 1e712687-ada3-68f0-93f8-c1ebf8e6fc8c
8cc06fd0-1268-11e7-a24b-96d95aa38c32 1e712688-cc06-6fd0-a828-671acd892c6a
9ea6a6b0-1268-11e7-a24b-96d95aa38c32 1e712689-ea6a-66b0-910c-dbcdb07df7a4
b08d04a0-1268-11e7-a24b-96d95aa38c32 1e71268b-08d0-64a0-bdce-21e3f9808705
c2733b80-1268-11e7-a24b-96d95aa38c32 1e71268c-2733-6b80-adf0-9f593e581a80
d455eff0-1268-11e7-a24b-96d95aa38c32 1e71268d-455e-6ff0-976d-54b9f0c63f24
e63b8a90-1268-11e7-a24b-96d95aa38c32 1e71268e-63b8-6a90-a002-1d1879d81eae
f81e8d20-1268-11e7-a24b-96d95aa38c32 1e71268f-81e8-6d20-b821-f70737f271b4
0a04eb10-1269-11e7-a24b-96d95aa38c32 1e712690-a04e-6b10-ac1f-c595b047b488
1beb21f0-1269-11e7-a24b-96d95aa38c32 1e712691-beb2-61f0-a993-9f20a401adda
2dd158d0-1269-11e7-a24b-96d95aa38c32 1e712692-dd15-68d0-b27d-3284b0309687
3fb7b6c0-1269-11e7-a24b-96d95aa38c32 1e712693-fb7b-66c0-9a9e-961ce88c3c37
519cb520-1269-11e7-a24b-96d95aa38c32 1e712695-19cb-6520-b122-851273f81332
637fb7b0-1269-11e7-a24b-96d95aa38c32 1e712696-37fb-67b0-accd-25b4845fe457
7563a4a0-1269-11e7-a24b-96d95aa38c32 1e712697-563a-64a0-9f9c-7d1b93251fb4
8748ca10-1269-11e7-a24b-96d95aa38c32 1e712698-748c-6a10-9d2a-210067965cb6
992b3060-1269-11e7-a24b-96d95aa38c32 1e712699-92b3-6060-aeed-faaed151443a
ab116740-1269-11e7-a24b-96d95aa38c32 1e71269a-b116-6740-a694-68c004266291
```


## Why not

### Performance

By default, this module generates a UUIDv1 and a series of random bytes to compose a single UUIDv6. As a result, id generation is slower than some alternatives. The `disableRandom` option improves performance but leaks MAC information.

```
uuid
  generate UUIDv1 ................................ 1,897,428 op/s
  generate UUIDv4 ................................ 420,446 op/s

uuid-with-v6
  generate UUIDv6 ................................ 276,106 op/s
  generate UUIDv6 without randomness ............. 855,674 op/s

uniqid
  generate UNIQID ................................ 2,635,674 op/s

flakeid
  generate Flake ID .............................. 1,290,409 op/s

puid
  generate PUID .................................. 1,106,059 op/s
  generate PUID without NodeId ................... 403,728 op/s

scuid
  generate SCUID ................................. 888,604 op/s

shortid
  generate ShortID ............................... 36,738 op/s

ulid
  generate ULID .................................. 29,562 op/s
```

The above statistics represent performance on a 2nd-generation Lenovo Carbon X1 (i5 2.90GHz, 8GB DDR3) running Ubuntu 16 LTS (16.04.2). [Your mileage may vary.](https://foldoc.org/ymmv) Read more about [uniqid](https://www.npmjs.com/package/uniqid), [flakeid](https://www.npmjs.com/package/flake-idgen), [puid](https://www.npmjs.com/package/puid), [scuid](https://www.npmjs.com/package/scuid) (faster [cuid](https://www.npmjs.com/package/cuid)), [shortid](https://www.npmjs.com/package/shortid), and [ulid](https://www.npmjs.com/package/ulid).

### Collision risk

By default, each UUIDv6 ends with 8 hex-encoded random bytes. If your application generates more than 4,294,967,296 ids per [100 nano-second interval](https://tools.ietf.org/html/rfc4122#section-4.1.4) you will certainly experience id collision. Furthermore, following the logic of the [birthday paradox](https://en.wikipedia.org/wiki/Birthday_problem#Approximations), the probability of a collision is greater than 50% when generating approximately 78,000 ids per interval:

```js
assert((1 - Math.pow(Math.E, ((-1 * (78000 * (78000 - 1))) / (2 * 4294967296)))) > .5)
```


## Development

### Tests

To run the full test suite, including unit tests, collision checks, and linting:

```sh
npm test
```

To run the only the unit test suite:

```sh
npm run test-unit
```

This project maintains 100% coverage of statements, branches, and functions. To determine unit test coverage:

```sh
npm run coverage
```

To run the performance benchmark suite:

```sh
npm run benchmark
```

### Contribute

PRs are welcome! PRs must pass unit tests, collision checks, and linting prior to merge. For bugs, please include a failing test which passes when your PR is applied. To enable a git hook that runs `npm test` prior to pushing, `cd` into your repo and run:

```sh
touch .git/hooks/pre-push
chmod +x .git/hooks/pre-push
echo "npm test" > .git/hooks/pre-push
```

### Versioning

This project follows [semantic versioning](http://semver.org/).


## References

- [RFC 4122](https://tools.ietf.org/html/rfc4122)


## License

- This module is licensed under the [ISC License](./LICENSE)
- The underlying uuid module is licensed under the [MIT License](https://github.com/kelektiv/node-uuid/blob/master/LICENSE.md)
