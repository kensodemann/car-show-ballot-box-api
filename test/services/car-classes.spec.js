'use strict';

const expect = require('chai').expect;
const MockClient = require('../mocks/mock-client');
const database = require('../../src/config/database');
const sinon = require('sinon');
const service = require('../../src/services/car-classes');

describe('service: car-classes', () => {
  let client;
  let testData;

  beforeEach(() => {
    testData = [
      {
        id: 1,
        name: 'A',
        description: 'Whatever Class A Is',
        active: true
      },
      {
        id: 2,
        name: 'B',
        description: 'Whatever Class B is',
        active: false
      },
      {
        id: 3,
        name: 'C',
        description: 'Some class C thing',
        active: true
      }
    ];
    client = new MockClient();
    sinon.stub(database, 'connect');
    database.connect.resolves(client);
  });

  afterEach(() => {
    database.connect.restore();
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      service.getAll();
      expect(database.connect.calledOnce).to.be.true;
    });

    it('queries the car classes', async () => {
      sinon.spy(client, 'query');
      await service.getAll();
      expect(client.query.calledOnce).to.be.true;
      expect(client.query.calledWith('select * from car_classes')).to.be.true;
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
