'use strict';

const expect = require('chai').expect;
const MockPool = require('../mocks/mock-pool');
const sinon = require('sinon');
const Service = require('../../src/services/car-shows');

describe('service: car-classes', () => {
  let pool;
  let service;
  let testData;

  beforeEach(() => {
    pool = new MockPool();
    sinon.stub(pool.test_client, 'query');
    pool.test_client.query.returns({ rows: [] });
    testData = {
      carShows: [
        {
          id: 1,
          name: 'Waukesha Show 2015',
          date: '2015-08-12',
          year: 2015
        },
        {
          id: 2,
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016
        },
        {
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017
        },
        {
          id: 4,
          name: 'Waukesha Show 2018',
          date: '2017-08-14',
          year: 2017
        }
      ],
      carShowClasses: [
        {
          id: 1,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          car_show_rid: 1
        },
        {
          id: 5,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          car_show_rid: 2
        },
        {
          id: 9,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          car_show_rid: 3
        },
        {
          id: 13,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          car_show_rid: 4
        },
        {
          id: 2,
          name: 'B',
          description: '1955-1962, Cars Only',
          car_show_rid: 1
        },
        {
          id: 6,
          name: 'B',
          description: '1955-1962, Cars Only',
          car_show_rid: 2
        },
        {
          id: 10,
          name: 'B',
          description: '1955-1962, Cars Only',
          car_show_rid: 3
        },
        {
          id: 14,
          name: 'B',
          description: '1955-1962, Cars Only',
          car_show_rid: 4
        },
        {
          id: 15,
          name: 'C',
          description: '1963-1967, Cars Only',
          car_show_rid: 4
        },
        {
          id: 11,
          name: 'C',
          description: '1963-1967, Cars Only',
          car_show_rid: 3
        },
        {
          id: 7,
          name: 'C',
          description: '1963-1967, Cars Only',
          car_show_rid: 2
        },
        {
          id: 3,
          name: 'C',
          description: '1963-1967, Cars Only',
          car_show_rid: 1
        },
        {
          id: 4,
          name: 'D',
          description: '1968-1970, Cars Only',
          car_show_rid: 1
        },
        {
          id: 8,
          name: 'D',
          description: '1968-1970, Cars Only',
          car_show_rid: 2
        },
        {
          id: 12,
          name: 'D',
          description: '1968-1970, Cars Only',
          car_show_rid: 3
        },
        {
          id: 16,
          name: 'D',
          description: '1968-1970, Cars Only',
          car_show_rid: 4
        }
      ]
    };
    service = new Service(pool);
  });

  afterEach(() => {
    pool.test_client.query.restore();
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows and classes', async () => {
      await service.getAll();
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from car_shows order by year desc'
        )
      ).to.be.true;
      expect(
        pool.test_client.query.calledWith('select * from car_show_classes')
      ).to.be.true;
    });

    it('returns the data', async () => {
      pool.test_client.query
        .onCall(0)
        .returns(Promise.resolve({ rows: testData.carShows }));
      pool.test_client.query
        .onCall(1)
        .returns(Promise.resolve({ rows: testData.carShowClasses }));
      const data = await service.getAll();
      expect(data).to.deep.equal([
        {
          id: 1,
          name: 'Waukesha Show 2015',
          date: '2015-08-12',
          year: 2015,
          classes: [
            {
              id: 1,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks'
            },
            {
              id: 2,
              name: 'B',
              description: '1955-1962, Cars Only'
            },
            {
              id: 3,
              name: 'C',
              description: '1963-1967, Cars Only'
            },
            {
              id: 4,
              name: 'D',
              description: '1968-1970, Cars Only'
            }
          ]
        },
        {
          id: 2,
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              id: 5,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks'
            },
            {
              id: 6,
              name: 'B',
              description: '1955-1962, Cars Only'
            },
            {
              id: 7,
              name: 'C',
              description: '1963-1967, Cars Only'
            },
            {
              id: 8,
              name: 'D',
              description: '1968-1970, Cars Only'
            }
          ]
        },
        {
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: [
            {
              id: 9,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks'
            },
            {
              id: 10,
              name: 'B',
              description: '1955-1962, Cars Only'
            },
            {
              id: 11,
              name: 'C',
              description: '1963-1967, Cars Only'
            },
            {
              id: 12,
              name: 'D',
              description: '1968-1970, Cars Only'
            }
          ]
        },
        {
          id: 4,
          name: 'Waukesha Show 2018',
          date: '2017-08-14',
          year: 2017,
          classes: [
            {
              id: 13,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks'
            },
            {
              id: 14,
              name: 'B',
              description: '1955-1962, Cars Only'
            },
            {
              id: 15,
              name: 'C',
              description: '1963-1967, Cars Only'
            },
            {
              id: 16,
              name: 'D',
              description: '1968-1970, Cars Only'
            }
          ]
        }
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getAll();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('get', () => {
    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.get(3);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows and classes', async () => {
      await service.get(3);
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from car_shows where id = $1',
          [3]
        )
      ).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from car_show_classes where car_show_rid = $1',
          [3]
        )
      ).to.be.true;
    });

    it('returns undefined if there is no car show', async () => {
      const data = await service.get(42);
      expect(data).to.be.undefined;
    });

    it('returns the data for the car show', async () => {
      pool.test_client.query
        .onCall(0)
        .returns(Promise.resolve({ rows: [testData.carShows[2]] }));
      pool.test_client.query.onCall(1).returns(
        Promise.resolve({
          rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 3)
        })
      );
      const data = await service.get(3);
      expect(data).to.deep.equal({
        id: 3,
        name: 'Waukesha Show 2017',
        date: '2017-08-10',
        year: 2017,
        classes: [
          {
            id: 9,
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks'
          },
          {
            id: 10,
            name: 'B',
            description: '1955-1962, Cars Only'
          },
          {
            id: 11,
            name: 'C',
            description: '1963-1967, Cars Only'
          },
          {
            id: 12,
            name: 'D',
            description: '1968-1970, Cars Only'
          }
        ]
      });
    });

    it('returns the data for a car show without classes', async () => {
      pool.test_client.query
        .onCall(0)
        .returns(Promise.resolve({ rows: [testData.carShows[2]] }));
      const data = await service.get(3);
      expect(data).to.deep.equal({
        id: 3,
        name: 'Waukesha Show 2017',
        date: '2017-08-10',
        year: 2017,
        classes: []
      });
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.get(3);
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });

  describe('get current', () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers(1471237200000);
    });

    afterEach(() => {
      clock.restore();
    });

    it('connects to the pool', () => {
      sinon.spy(pool, 'connect');
      service.getCurrent();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows', async () => {
      await service.getCurrent();
      expect(pool.test_client.query.calledOnce).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from car_shows where year = $1',
          [2016]
        )
      ).to.be.true;
    });

    it('querys the classes if the car show query returns a show', async () => {
      pool.test_client.query
        .onCall(0)
        .returns(Promise.resolve({ rows: [testData.carShows[1]] }));
      await service.getCurrent();
      expect(pool.test_client.query.calledTwice).to.be.true;
      expect(
        pool.test_client.query.calledWith(
          'select * from car_show_classes where car_show_rid = $1',
          [2]
        )
      ).to.be.true;
    });

    it('returns undefined if there is no current car show', async () => {
      const show = await service.getCurrent();
      expect(show).to.be.undefined;
    });

    it('returns the combined data', async () => {
      pool.test_client.query
        .onCall(0)
        .returns(Promise.resolve({ rows: [testData.carShows[1]] }));
      pool.test_client.query.onCall(1).returns(
        Promise.resolve({
          rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 2)
        })
      );
      const show = await service.getCurrent();
      expect(show).to.deep.equal({
        id: 2,
        name: 'Waukesha Show 2016',
        date: '2016-08-11',
        year: 2016,
        classes: [
          {
            id: 5,
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks'
          },
          {
            id: 6,
            name: 'B',
            description: '1955-1962, Cars Only'
          },
          {
            id: 7,
            name: 'C',
            description: '1963-1967, Cars Only'
          },
          {
            id: 8,
            name: 'D',
            description: '1968-1970, Cars Only'
          }
        ]
      });
    });

    it('releases the client', async () => {
      sinon.spy(pool.test_client, 'release');
      await service.getCurrent();
      expect(pool.test_client.release.calledOnce).to.be.true;
    });
  });
});
