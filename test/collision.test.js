/* global describe, it, beforeEach, afterEach */
/* eslint-disable global-require, import/no-extraneous-dependencies, strict */

'use strict';

const expect = require('chai').expect;

describe('collision: uuid#v6', () => {
  const v6 = require('../dist').v6;

  it('does not collide when generating 1,000,000 sequential ids in a single process', () => {
    function check() {
      const seen = new Set();

      while (seen.size < 1000000) {
        const id = v6();

        if (seen.has(id)) {
          throw new Error('collision');
        }

        seen.add(id);
      }
    }

    expect(check).to.not.throw(Error);
  }).timeout(30000);
});

describe('collision: uuid#v6 with disableRandom option activated', () => {
  const v6 = require('../dist').v6setup({ disableRandom: true });

  it('does not collide when generating 1,000,000 sequential ids in a single process', () => {
    function check() {
      const seen = new Set();

      while (seen.size < 1000000) {
        const id = v6();

        if (seen.has(id)) {
          throw new Error('collision');
        }

        seen.add(id);
      }
    }

    expect(check).to.not.throw(Error);
  }).timeout(30000);
});
