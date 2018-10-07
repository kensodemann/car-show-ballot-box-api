'use strict';

const expect = require('chai').expect;
const MockClient = require('../mocks/mock-client');
const pool = require('../../src/config/database');
const sinon = require('sinon');
const service = require('../../src/services/car-shows');

describe('service: car-classes', () => {
  let client;
  let testData;

  beforeEach(() => {
    client = new MockClient();
    sinon.stub(pool, 'connect');
    pool.connect.resolves(client);
    sinon.stub(client, 'query');
    client.query.returns({ rows: [] });
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
          active: true,
          car_show_rid: 1
        },
        {
          id: 5,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          active: true,
          car_show_rid: 2
        },
        {
          id: 9,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          active: true,
          car_show_rid: 3
        },
        {
          id: 13,
          name: 'A',
          description: 'Antique through 1954, Cars & Trucks',
          active: true,
          car_show_rid: 4
        },
        {
          id: 2,
          name: 'B',
          description: '1955-1962, Cars Only',
          active: true,
          car_show_rid: 1
        },
        {
          id: 6,
          name: 'B',
          description: '1955-1962, Cars Only',
          active: true,
          car_show_rid: 2
        },
        {
          id: 10,
          name: 'B',
          description: '1955-1962, Cars Only',
          active: true,
          car_show_rid: 3
        },
        {
          id: 14,
          name: 'B',
          description: '1955-1962, Cars Only',
          active: true,
          car_show_rid: 4
        },
        {
          id: 15,
          name: 'C',
          description: '1963-1967, Cars Only',
          active: true,
          car_show_rid: 4
        },
        {
          id: 11,
          name: 'C',
          description: '1963-1967, Cars Only',
          active: true,
          car_show_rid: 3
        },
        {
          id: 7,
          name: 'C',
          description: '1963-1967, Cars Only',
          active: true,
          car_show_rid: 2
        },
        {
          id: 3,
          name: 'C',
          description: '1963-1967, Cars Only',
          active: true,
          car_show_rid: 1
        },
        {
          id: 4,
          name: 'D',
          description: '1968-1970, Cars Only',
          active: true,
          car_show_rid: 1
        },
        {
          id: 8,
          name: 'D',
          description: '1968-1970, Cars Only',
          active: true,
          car_show_rid: 2
        },
        {
          id: 12,
          name: 'D',
          description: '1968-1970, Cars Only',
          active: true,
          car_show_rid: 3
        },
        {
          id: 16,
          name: 'D',
          description: '1968-1970, Cars Only',
          active: true,
          car_show_rid: 4
        }
      ]
    };
  });

  afterEach(() => {
    pool.connect.restore();
  });

  describe('getAll', () => {
    it('connects to the pool', () => {
      service.getAll();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows and classes', async () => {
      await service.getAll();
      expect(client.query.calledTwice).to.be.true;
      expect(
        client.query.calledWith('select * from car_shows order by year desc')
      ).to.be.true;
      expect(client.query.calledWith('select * from car_show_classes')).to.be
        .true;
    });

    it('returns the data', async () => {
      client.query.onCall(0).resolves({ rows: testData.carShows });
      client.query.onCall(1).resolves({ rows: testData.carShowClasses });
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
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 2,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 3,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 4,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
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
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 6,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 7,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 8,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
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
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 10,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 11,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 12,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
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
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 14,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 15,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 16,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        }
      ]);
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.getAll();
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('get', () => {
    it('connects to the pool', () => {
      service.get(3);
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows and classes', async () => {
      await service.get(3);
      expect(client.query.calledTwice).to.be.true;
      expect(
        client.query.calledWith('select * from car_shows where id = $1', [3])
      ).to.be.true;
      expect(
        client.query.calledWith(
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
      client.query.onCall(0).resolves({ rows: [testData.carShows[2]] });
      client.query.onCall(1).resolves({
        rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 3)
      });
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
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            id: 10,
            name: 'B',
            description: '1955-1962, Cars Only',
            active: true
          },
          {
            id: 11,
            name: 'C',
            description: '1963-1967, Cars Only',
            active: true
          },
          {
            id: 12,
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]
      });
    });

    it('returns the data for a car show without classes', async () => {
      client.query.onCall(0).resolves({ rows: [testData.carShows[2]] });
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
      sinon.spy(client, 'release');
      await service.get(3);
      expect(client.release.calledOnce).to.be.true;
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
      service.getCurrent();
      expect(pool.connect.calledOnce).to.be.true;
    });

    it('queries the car shows', async () => {
      await service.getCurrent();
      expect(client.query.calledOnce).to.be.true;
      expect(
        client.query.calledWith('select * from car_shows where year = $1', [
          2016
        ])
      ).to.be.true;
    });

    it('querys the classes if the car show query returns a show', async () => {
      client.query.onCall(0).resolves({ rows: [testData.carShows[1]] });
      await service.getCurrent();
      expect(client.query.calledTwice).to.be.true;
      expect(
        client.query.calledWith(
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
      client.query.onCall(0).resolves({ rows: [testData.carShows[1]] });
      client.query.onCall(1).resolves({
        rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 2)
      });
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
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            id: 6,
            name: 'B',
            description: '1955-1962, Cars Only',
            active: true
          },
          {
            id: 7,
            name: 'C',
            description: '1963-1967, Cars Only',
            active: true
          },
          {
            id: 8,
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]
      });
    });

    it('releases the client', async () => {
      sinon.spy(client, 'release');
      await service.getCurrent();
      expect(client.release.calledOnce).to.be.true;
    });
  });

  describe('save', () => {
    describe('existing show', () => {
      let testCarShow;
      beforeEach(() => {
        testCarShow = {
          id: 2,
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              id: 5,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 7,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: false
            },
            {
              id: 8,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        };
      });

      it('connects to the pool', () => {
        service.save(testCarShow);
        expect(pool.connect.calledOnce).to.be.true;
      });

      it('updates the show', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith(
            'update car_shows set name = $1, date = $2, year = $3 where id = $4',
            ['Waukesha Show 2016', '2016-08-11', 2016, 2]
          )
        ).to.be.true;
      });

      it('updates the existing classes', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith(
            'update car_show_classes set name = $1, description = $2, active = $3, car_show_rid = $4 where id = $5',
            ['A', 'Antique through 1954, Cars & Trucks', true, 2, 5]
          )
        ).to.be.true;
        expect(
          client.query.calledWith(
            'update car_show_classes set name = $1, description = $2, active = $3, car_show_rid = $4 where id = $5',
            ['C', '1963-1967, Cars Only', false, 2, 7]
          )
        ).to.be.true;
        expect(
          client.query.calledWith(
            'update car_show_classes set name = $1, description = $2, active = $3, car_show_rid = $4 where id = $5',
            ['D', '1968-1970, Cars Only', true, 2, 8]
          )
        ).to.be.true;
      });

      it('inserts any classes that were added', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith(
            'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
            ['B', '1955-1962, Cars Only', true, 2]
          )
        ).to.be.true;
      });

      it('queries the show and classes for the show', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith('select * from car_shows where id = $1', [2])
        ).to.be.true;
        expect(
          client.query.calledWith(
            'select * from car_show_classes where car_show_rid = $1',
            [2]
          )
        ).to.be.true;
      });

      it('returns the show as queried', async () => {
        client.query.onCall(5).resolves({ rows: [testData.carShows[1]] });
        client.query.onCall(6).resolves({
          rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 2)
        });
        const show = await service.save(testCarShow);
        expect(show).to.deep.equal({
          id: 2,
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              id: 5,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 6,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 7,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 8,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        });
      });

      it('releases the client', async () => {
        sinon.spy(client, 'release');
        await service.save(testCarShow);
        expect(client.release.calledOnce).to.be.true;
      });
    });

    describe('new show', () => {
      let testCarShow;
      beforeEach(() => {
        testCarShow = {
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              name: 'B',
              description: '1955-1962, Cars Only',
              active: false
            },
            {
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        };

        client.query.onCall(0).resolves({ rows: [{ id: 42 }] });
      });

      it('connects to the pool', () => {
        service.save(testCarShow);
        expect(pool.connect.calledOnce).to.be.true;
      });

      it('inserts the show', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith(
            'insert into car_shows (name, date, year) values ($1, $2, $3) returning id',
            ['Waukesha Show 2016', '2016-08-11', 2016]
          )
        ).to.be.true;
      });

      it('insert the classes for the show', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith(
            'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
            ['A', 'Antique through 1954, Cars & Trucks', true, 42]
          )
        ).to.be.true;
        expect(
          client.query.calledWith(
            'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
            ['B', '1955-1962, Cars Only', false, 42]
          )
        ).to.be.true;
        expect(
          client.query.calledWith(
            'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
            ['D', '1968-1970, Cars Only', true, 42]
          )
        ).to.be.true;
      });

      it('queries the show and classes for the dhow', async () => {
        await service.save(testCarShow);
        expect(
          client.query.calledWith('select * from car_shows where id = $1', [42])
        ).to.be.true;
        expect(
          client.query.calledWith(
            'select * from car_show_classes where car_show_rid = $1',
            [42]
          )
        ).to.be.true;
      });

      it('returns the show as queried', async () => {
        client.query.onCall(4).resolves({ rows: [testData.carShows[1]] });
        client.query.onCall(5).resolves({
          rows: testData.carShowClasses.filter(cls => cls.car_show_rid === 2)
        });
        const show = await service.save(testCarShow);
        expect(show).to.deep.equal({
          id: 2,
          name: 'Waukesha Show 2016',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              id: 5,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: 6,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: true
            },
            {
              id: 7,
              name: 'C',
              description: '1963-1967, Cars Only',
              active: true
            },
            {
              id: 8,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        });
      });

      it('releases the client', async () => {
        sinon.spy(client, 'release');
        await service.save(testCarShow);
        expect(client.release.calledOnce).to.be.true;
      });
    });
  });
});
