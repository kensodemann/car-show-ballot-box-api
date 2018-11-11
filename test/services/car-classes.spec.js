'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const service = require('../../src/services/car-classes');
const testDatabase = require('../util/test-database');
const testData = require('../util/test-data');

describe('service: car-classes', () => {
  before(async () => {
    await testDatabase.reload();
  });

  afterEach(() => {
    expect(database.idleCount).to.equal(database.totalCount);
  });

  describe('getAll', () => {
    it('returns the data', async () => {
      const data = await service.getAll();
      expect(data.length).to.equal(testData.classes.length);
      expect(data).to.deep.equal(testData.classes);
    });
  });
});
