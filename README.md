uuid-with-v6
============

UUID Version 6 for Node.js


## Quickstart

```js
const uuid = require('uuid-with-v6');

console.log(uuid.v6())
```


## API

This module extends `uuid` and is intended to serve as a drop-in replacement with added "Version 6" functionality.

### `uuid#v1`

See the [`uuid` documentation](https://github.com/kelektiv/node-uuid#uuidv1options--buffer--offset).

### `uuid#v4`

See the [`uuid` documentation](https://github.com/kelektiv/node-uuid#uuidv4options--buffer--offset).

### `uuid#v6`

#### Definition

```js
uuid.v6()
```

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

### `uuid#v6create`

#### Definition

```js
uuid.v6create([options])
```

#### Parameters

**`options` parameters**

| Parameter | Type | Description | Default |
| :-------- | :--- | :---------- | :------ |
| `disableRandom` | `Boolean` | Disable the use of UUIDv4 to populate the non-timestamp portion of the identifier | 'false' |

#### Returns

A UUIDv6 id generator.

#### Example

```js
const uuid = require('uuid-with-v6');

const v6 = uuid.v6create();

console.log(v6());
// 1e7126af-f130-6780-adb4-8bbe7368fc2f

const v6WithMAC = uuid.v6create({ disableRandom: true });

console.log(v6WithMAC());
// '1e7126cb-6914-60b0-8c07-8a41b327fae3'
```


## Why

Inspired by [UUID "Version 6", *The version RFC 4122 forgot*](https://bradleypeabody.github.io/uuidv6/), this module extends the popular [uuid module](https://www.npmjs.com/package/uuid) to provide a `v6` method.

"Version 6" UUIDs arrange the timestamp from high to low bytes (with some bit-shifting to account for the version parameter) resulting in high entropy identifiers where lexicographic sorting also yields time-based sorting. The non-timestamp portion of the UUID is filled with random bits (similar to Version 4); consequently, ids generated within the same clock tick are not guaranteed to be lexicographically sorted. That said, the clock sequence is retained to mitigate time-based collisions within the same process.

Internally, this module implements the "Version 6" specification by first generating a UUIDv1, rearranging the timestamp, then generating 8 cryptographically strong bytes to populate the remaining portion of the identifier. Similar to Version 1, the MAC address data can be retained by constructing a UUIDv6 generator with the `disableRandom` option enabled (see examples below).

### UUIDv1 versus UUIDv6

Below are 20 UUIDv1 identifiers and the corresponding UUIDv6 identifiers generated at 30 second intervals. Note the key differences:

- The "high" portion of the timestamp is at the beginning, followed by the "medium" and "low"
- `xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx` &rarr; `xxxxxxxx-xxxx-6xxx-xxxx-xxxxxxxxxxxx`
- Each identifier ends with cryptographically-strong randomness

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

This module generates a UUIDv1 as well as a series of random bytes to compose a single UUIDv6. As a result, id generation is slower than some alternatives.

```
scuid
  generate id .................................... 935,316 op/s

uild
  generate id .................................... 31,383 op/s

uuid
  generate UUIDv1 ................................ 1,643,958 op/s
  generate UUIDv4 ................................ 378,027 op/s

uuid-with-v6
  generate UUIDv6 ................................ 259,167 op/s
  generate UUIDv6 with MAC ....................... 840,126 op/s
```

The above statistics represent performance on a 2nd-generation Lenovo Carbon X1 (i5@1.90GHz, 8GB DDR3) running Ubuntu 16 LTS (16.04.2). [Your mileage may vary.](https://foldoc.org/ymmv) If interested, read more about [ulid](https://www.npmjs.com/package/ulid) and [scuid](https://www.npmjs.com/package/scuid), the later of which is a faster version of [cuid](https://www.npmjs.com/package/cuid).

### Collision risk

Each UUIDv6 ends with 8 random bytes encoded as hex. If your application generates more than 4,294,967,296 ids per [100 nano-seconds](https://tools.ietf.org/html/rfc4122#section-4.1.4) you will almost certainly experience an id collision. Furthermore, following the logic of the [birthday paradox](https://en.wikipedia.org/wiki/Birthday_problem), the probability of a collision is greater than 50% at approximately 78,000 ids per interval.


## References

- [RFC 4122](https://tools.ietf.org/html/rfc4122)


## License

- This module is licensed under the [ISC License](./LICENSE)
- This underlying uuid module is licensed under the [MIT License](https://github.com/kelektiv/node-uuid/blob/master/LICENSE.md)
