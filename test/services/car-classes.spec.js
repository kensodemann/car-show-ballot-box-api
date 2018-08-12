'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Service = require('../../src/services/car-classes');

describe('service: car-classes', () => {
  let pool;
  let service;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
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
    service = new Service(pool);
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car classes', async () => {
      sinon.spy(pool.test_client, 'query');
      await service.getAll();
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(pool.test_client.query.calledWith('select * from car_classes'))
        .to.be.true;
    });

    it('returns the data', async () => {
      sinon.stub(pool.test_client, 'query');
      pool.test_client.query.returns(Promise.resolve({ rows: testData }));
      const data = await service.getAll();
      expect(data).to.deep.equal(testData);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getAll();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
