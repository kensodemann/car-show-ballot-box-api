'use strict';

const expect = require('chai').expect;
const MockClient = require('../util/mock-client');
const database = require('../../src/config/database');
const sinon = require('sinon');
const service = require('../../src/services/car-classes');
const testDatabase = require('../util/test-database');
const testData = require('../util/test-data');

describe('service: car-classes', () => {
  before(async () => {
    await testDatabase.reload();
  });

  describe('getAll', () => {
    it('connects to the database', () => {
      sinon.spy(database, 'connect');
      service.getAll();
      expect(database.connect.calledOnce).to.be.true;
      database.connect.restore();
    });

    it('queries the car classes', async () => {
      const client = new MockClient();
      sinon.stub(database, 'connect');
      database.connect.resolves(client);
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      database.connect.restore();
    });

    it('returns the data', async () => {
      const data = await service.getAll();
      expect(data.length).to.equal(testData.classes.length);
      expect(data).to.deep.equal(testData.classes);
    });

    it('releases the client', async () => {
      const client = new MockClient();
      sinon.stub(database, 'connect');
      database.connect.resolves(client);
      sinon.spy(client, 'release');
      await service.getAll();
      expect(client.release.calledOnce).to.be.true;
      database.connect.restore();
    });
  });
});
