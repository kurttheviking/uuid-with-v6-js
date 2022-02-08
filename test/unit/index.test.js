/* global describe, it, beforeEach, afterEach */
/* eslint-disable global-require, import/no-extraneous-dependencies, strict */

'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

// [KE] see https://gist.github.com/jed/982883
function uuid(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)}  // eslint-disable-line

describe('uuid#v6', () => {
  let index;
  let v1;
  let v4;
  let v5;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    v1 = sinon.stub().returns(uuid());
    v4 = sinon.stub().returns(uuid());
    v5 = sinon.stub().returns(uuid());

    mockery.registerMock('uuid', { v1, v4, v5 });

    index = require('../../dist');
  });

  afterEach(() => {
    mockery.disable();
  });

  it('exports uuid#v1 as a function', () => {
    expect(index.v1).to.be.a('function');
  });

  it('exports uuid#v4 as a function', () => {
    expect(index.v4).to.be.a('function');
  });

  it('exports uuid#v5 as a function', () => {
    expect(index.v5).to.be.a('function');
  });

  it('exports v6 function', () => {
    expect(index.v6).to.be.a('function');
  });

  it('exports v6setup function', () => {
    expect(index.v6setup).to.be.a('function');
  });

  it('v6 returns a string', () => {
    const id = index.v6();

    expect(id).to.be.a('string');
  });

  it('output has same shape as uuid#v4', () => {
    const id = index.v6();
    const idv4 = uuid();

    const idParts = id.split('-');
    const idv4Parts = idv4.split('-');

    expect(idParts.length).to.equal(idv4Parts.length);

    idParts.forEach((segment, i) => {
      expect(segment.length).to.equal(idv4Parts[i].length);
    });
  });

  it('generates different random data', () => {
    const idA = index.v6();
    const idB = index.v6();

    expect(idA.substr(19)).to.not.equal(idB.substr(19));
  });
});

describe('uuid#v6 with disableRandom option activated', () => {
  let v1;
  let v4;
  let v5;
  let v6;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    v1 = sinon.stub().returns(uuid());
    v4 = sinon.stub().returns(uuid());
    v5 = sinon.stub().returns(uuid());

    mockery.registerMock('uuid/v1', v1);
    mockery.registerMock('uuid/v4', v4);
    mockery.registerMock('uuid/v5', v5);

    v6 = require('../../dist').v6setup({ disableRandom: true });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('output has same shape as UUIDv4', () => {
    const id = v6();
    const idv4 = uuid();

    const idParts = id.split('-');
    const idv4Parts = idv4.split('-');

    expect(idParts.length).to.equal(idv4Parts.length);

    idParts.forEach((segment, i) => {
      expect(segment.length).to.equal(idv4Parts[i].length);
    });
  });

  it('generates same final MAC data', () => {
    const idA = v6();
    const idB = v6();

    expect(idA.substr(19)).to.equal(idB.substr(19));
  });
});
