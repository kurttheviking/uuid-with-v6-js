/* global describe, it, beforeEach, afterEach */
/* eslint-disable global-require, import/no-extraneous-dependencies, strict */

'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');
const uuid = require('uuid');

describe('uuid#v6', () => {
  let index;
  let uuidStub;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    uuidStub = {
      v1: sinon.stub().returns(uuid.v1()),
      v4: sinon.stub().returns(uuid.v4())
    };

    mockery.registerMock('uuid', uuidStub);

    index = require('../../index');
  });

  afterEach(() => {
    mockery.disable();
  });

  it('exports uuid#v1 as v1 function', () => {
    expect(index.v1).to.be.a('function');
  });

  it('exports uuid#v4 as v4 function', () => {
    expect(index.v4).to.be.a('function');
  });

  it('exports a v6 function', () => {
    expect(index.v4).to.be.a('function');
  });

  it('exports a v6create function', () => {
    expect(index.v6create).to.be.a('function');
  });

  it('proxies uuid#v1 calls', () => {
    index.v1();

    expect(uuidStub.v1.callCount).to.equal(1);
  });

  it('proxies uuid#v4 calls', () => {
    index.v4();

    expect(uuidStub.v4.callCount).to.equal(1);
  });

  it('v6 function invokes uuid#v1', () => {
    index.v6();

    expect(uuidStub.v1.callCount).to.equal(1);
    expect(uuidStub.v4.callCount).to.equal(0);
  });

  it('v6 returns a string', () => {
    const id = index.v6();

    expect(id).to.be.a('string');
  });

  it('output has same shape as UUIDv4', () => {
    const id = index.v6();
    const idv4 = uuid.v4();

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
  let v6;
  let uuidStub;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    uuidStub = {
      v1: sinon.stub().returns(uuid.v1()),
      v4: sinon.stub().returns(uuid.v4())
    };

    mockery.registerMock('uuid', uuidStub);

    v6 = require('../../index').v6create({ disableRandom: true });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('output has same shape as UUIDv4', () => {
    const id = v6();
    const idv4 = uuid.v4();

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
