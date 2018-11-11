'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const sinon = require('sinon');
const service = require('../../src/services/car-shows');
const testData = require('../util/test-data');
const testDatabase = require('../util/test-database');

describe.only('service: car-classes', () => {
  before(async () => {
    await testDatabase.reload();
  });

  afterEach(() => {
    expect(database.idleCount).to.equal(database.totalCount);
  });

  describe('getAll', () => {
    it('returns the data', async () => {
      const data = await service.getAll();
      expect(data).to.deep.equal([
        {
          id: 4,
          name: 'Waukesha Show 2018',
          date: '2018-08-14',
          year: 2018,
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
        }
      ]);
    });
  });

  describe('get', () => {
    it('returns undefined if there is no car show', async () => {
      const data = await service.get(42);
      expect(data).to.be.undefined;
    });

    it('returns the data for the car show', async () => {
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
  });

  describe('get current', () => {
    let clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers(1471237200000);
    });

    afterEach(() => {
      clock.restore();
    });

    it('returns the combined data', async () => {
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
  });

  describe('save', () => {
    describe.only('existing show', () => {
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
              id: 6,
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

      it('updates the show name', async () => {
        testCarShow.name = 'something different';
        await service.save(testCarShow);
        const res = await database.query('select name from car_shows where id = 2');
        expect(res.rows[0].name).to.equal('something different');
      });

      it('updates the show date', async () => {
        testCarShow.date = '2016-07-04'
        await service.save(testCarShow);
        const res = await database.query('select date from car_shows where id = 2');
        expect(res.rows[0].date).to.equal('2016-07-04');
      });

      it('updates the show year', async () => {
        testCarShow.year = 2019;
        await service.save(testCarShow);
        const res = await database.query('select year from car_shows where id = 2');
        expect(res.rows[0].year).to.equal(2019);
      });

      it('updates the existing classes', async () => {
        testCarShow.classes[0].name = 'Z';
        testCarShow.classes[1].description = 'Zombies';
        testCarShow.classes[2].active = false;
        await service.save(testCarShow);
        const res0 = await database.query('select name from car_show_classes where id = 5');
        const res1 = await database.query('select description from car_show_classes where id = 6');
        const res2 = await database.query('select active from car_show_classes where id = 7');
        expect(res0.rows[0].name).to.equal('Z');
        expect(res1.rows[0].description).to.equal('Zombies');
        expect(res2.rows[0].active).to.equal(false);
      });

      // it('inserts any classes that were added', async () => {
      //   await service.save(testCarShow);
      //   expect(
      //     client.query.calledWith(
      //       'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
      //       ['B', '1955-1962, Cars Only', true, 2]
      //     )
      //   ).to.be.true;
      // });

      // it('returns the show as updated', async () => {
      //   const show = await service.save(testCarShow);
      //   expect(show).to.deep.equal({
      //     id: 2,
      //     name: 'Waukesha Show 2016',
      //     date: '2016-08-11',
      //     year: 2016,
      //     classes: [
      //       {
      //         id: 5,
      //         name: 'A',
      //         description: 'Antique through 1954, Cars & Trucks',
      //         active: true
      //       },
      //       {
      //         id: 6,
      //         name: 'B',
      //         description: '1955-1962, Cars Only',
      //         active: true
      //       },
      //       {
      //         id: 7,
      //         name: 'C',
      //         description: '1963-1967, Cars Only',
      //         active: true
      //       },
      //       {
      //         id: 8,
      //         name: 'D',
      //         description: '1968-1970, Cars Only',
      //         active: true
      //       }
      //     ]
      //   });
      // });
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

      it('connects to the database', () => {
        service.save(testCarShow);
        expect(database.connect.calledOnce).to.be.true;
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
