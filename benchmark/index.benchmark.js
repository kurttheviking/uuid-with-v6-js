/* global suite, bench */
/* eslint global-require: 0, import/no-extraneous-dependencies: 0 */

const scuid = require('scuid');
const uuidv6 = require('../index');
const uild = require('ulid');
const uuid = require('uuid');

const uuidv6WithMAC = require('../index').v6create({ disableRandom: true });

suite('scuid', () => {
  bench('generate id', () => scuid());
});

suite('uild', () => {
  bench('generate id', () => uild());
});

suite('uuid', () => {
  bench('generate UUIDv1', () => uuid.v1());
  bench('generate UUIDv4', () => uuid.v4());
});

suite('uuidv6', () => {
  bench('generate UUIDv6', () => uuidv6.v6());
  bench('generate UUIDv6 with MAC', () => uuidv6WithMAC());
});
