'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const sinon = require('sinon');
const service = require('../../src/services/car-shows');
const testData = require('../util/test-data');
const testDatabase = require('../util/test-database');

describe('service: car-shows', () => {
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
    afterEach(async () => {
      await testDatabase.reload();
    });

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
        };
      });

      it('updates the show name', async () => {
        testCarShow.name = 'something different';
        await service.save(testCarShow);
        const res = await database.query(
          'select name from car_shows where id = 2'
        );
        expect(res.rows[0].name).to.equal('something different');
      });

      it('updates the show date', async () => {
        testCarShow.date = '2016-07-04';
        await service.save(testCarShow);
        const res = await database.query(
          'select date from car_shows where id = 2'
        );
        expect(res.rows[0].date).to.equal('2016-07-04');
      });

      it('updates the show year', async () => {
        testCarShow.year = 2019;
        await service.save(testCarShow);
        const res = await database.query(
          'select year from car_shows where id = 2'
        );
        expect(res.rows[0].year).to.equal(2019);
      });

      it('updates the existing classes', async () => {
        testCarShow.classes[0].name = 'Z';
        testCarShow.classes[1].description = 'Zombies';
        testCarShow.classes[2].active = false;
        await service.save(testCarShow);
        const res0 = await database.query(
          'select name from car_show_classes where id = 5'
        );
        const res1 = await database.query(
          'select description from car_show_classes where id = 6'
        );
        const res2 = await database.query(
          'select active from car_show_classes where id = 7'
        );
        expect(res0.rows[0].name).to.equal('Z');
        expect(res1.rows[0].description).to.equal('Zombies');
        expect(res2.rows[0].active).to.equal(false);
      });

      it('inserts any classes that were added', async () => {
        testCarShow.classes.push({
          name: 'X',
          description: 'The Truth is Out There',
          active: true
        });
        await service.save(testCarShow);
        const id = testData.carShowClasses.length + 1;
        const res = await database.query(
          'select * from car_show_classes where id = $1',
          [id]
        );
        expect(res.rows[0]).to.deep.equal({
          id: id,
          name: 'X',
          description: 'The Truth is Out There',
          active: true,
          car_show_rid: 2
        });
      });

      it('returns the show as updated', async () => {
        testCarShow.name = 'I am Renamed';
        testCarShow.classes[0].name = 'Z';
        testCarShow.classes[1].description = 'Zombies';
        testCarShow.classes[2].active = false;
        testCarShow.classes.push({
          name: 'X',
          description: 'The Truth is Out There',
          active: true
        });
        const id = testData.carShowClasses.length + 1;
        const show = await service.save(testCarShow);
        expect(show).to.deep.equal({
          id: 2,
          name: 'I am Renamed',
          date: '2016-08-11',
          year: 2016,
          classes: [
            {
              id: 6,
              name: 'B',
              description: 'Zombies',
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
            },
            {
              id: id,
              name: 'X',
              description: 'The Truth is Out There',
              active: true
            },
            {
              id: 5,
              name: 'Z',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            }
          ]
        });
      });
    });

    describe('new show', () => {
      let testCarShow;
      let carShowId;
      let firstClassId;
      beforeEach(() => {
        testCarShow = {
          name: 'Waukesha Show 2019',
          date: '2019-08-14',
          year: 2019,
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
        carShowId = testData.carShows.length + 1;
        firstClassId = testData.carShowClasses.length + 1;
      });

      it('inserts the show', async () => {
        await service.save(testCarShow);
        const res = await database.query(
          'select * from car_shows where id = $1',
          [carShowId]
        );
        expect(res.rows[0]).to.deep.equal({
          id: carShowId,
          name: 'Waukesha Show 2019',
          date: '2019-08-14',
          year: 2019
        });
      });

      it('insert the classes for the show', async () => {
        await service.save(testCarShow);
        const res = await database.query(
          'select * from car_show_classes where car_show_rid = $1 order by id',
          [carShowId]
        );
        expect(res.rows.length).to.equal(3);
      });

      it('returns the show as inserted', async () => {
        const show = await service.save(testCarShow);
        expect(show).to.deep.equal({
          id: carShowId,
          name: 'Waukesha Show 2019',
          date: '2019-08-14',
          year: 2019,
          classes: [
            {
              id: firstClassId,
              name: 'A',
              description: 'Antique through 1954, Cars & Trucks',
              active: true
            },
            {
              id: firstClassId + 1,
              name: 'B',
              description: '1955-1962, Cars Only',
              active: false
            },
            {
              id: firstClassId + 2,
              name: 'D',
              description: '1968-1970, Cars Only',
              active: true
            }
          ]
        });
      });
    });
  });
});
