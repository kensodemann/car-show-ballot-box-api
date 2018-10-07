'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const MockClient = require('../mocks/mock-client');
const sinon = require('sinon');
const service = require('../../src/services/votes');

describe('service: votes', () => {
  let client;
  let testData;

  beforeEach(() => {
    client = new MockClient();
    sinon.stub(database, 'connect');
    database.connect.resolves(client);
    testData = [
      {
        id: 1,
        year: 2018,
        car_class_rid: 3,
        car_number: 42
      },
      {
        id: 2,
        year: 2018,
        car_class_rid: 2,
        car_number: 314
      },
      {
        id: 3,
        year: 2018,
        car_class_rid: 3,
        car_number: 73
      }
    ];
  });

  afterEach(() => {
    database.connect.restore();
  });

  describe('getAll', () => {
    it('connects to the database', () => {
      service.getAll();
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the votes', async () => {
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      expect(client.query.calledWith('select * from votes')).to.be.true;
    });

    it('limits by year if given', async () => {
      sinon.spy(client, 'query');
      await service.getAll(2019);
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith('select * from votes where year = $1', [2019])
      ).to.be.true;
    });

    it('returns the data', async () => {
      sinon.stub(client, 'query');
      client.query.resolves({ rows: testData });
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.getAll();
      expect(client.release.calledOnce).to.be.true;
    });
  });
});
