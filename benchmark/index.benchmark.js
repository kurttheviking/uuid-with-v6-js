/* global suite, bench */
/* eslint global-require: 0, import/no-extraneous-dependencies: 0 */

const scuid = require('scuid');
const uild = require('ulid');
const uniqid = require('uniqid');
const uuid = require('uuid');

const index = require('../index');

const v6WithMAC = index.v6setup({ disableRandom: true });

suite('uuid', () => {
  bench('generate UUIDv1', () => uuid.v1());
  bench('generate UUIDv4', () => uuid.v4());
});

suite('uuid-with-v6', () => {
  bench('generate UUIDv6', () => index.v6());
  bench('generate UUIDv6 without randomness', () => v6WithMAC());
});

suite('uniqid', () => {
  bench('generate UNIQID', () => uniqid());
});

suite('scuid', () => {
  bench('generate SCUID', () => scuid());
});

suite('ulid', () => {
  bench('generate ULID', () => uild());
});
