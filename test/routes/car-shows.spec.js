'use strict';

const carShows = require('../../src/services/car-shows');
const expect = require('chai').expect;
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /car-shows', () => {
  const app = express();
  require('../../src/config/express')(app);
  require('../../src/routes/car-shows')(app);
  let testData;

  beforeEach(() => {
    testData = [
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
    ];
  });

  describe('get', () => {
    describe('all', () => {
      beforeEach(() => {
        sinon.stub(carShows, 'getAll').resolves([]);
      });

      afterEach(() => {
        carShows.getAll.restore();
      });

      it('calls the getAll method', done => {
        request(app)
          .get('/car-shows')
          .end(() => {
            expect(carShows.getAll.calledOnce).to.be.true;
            expect(carShows.getAll.calledWithExactly()).to.be.true;
            done();
          });
      });

      it('returns an empty array if there is no data', done => {
        request(app)
          .get('/car-shows')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([]);
            done();
          });
      });

      it('returns the data', done => {
        carShows.getAll.resolves(testData);
        request(app)
          .get('/car-shows')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(testData);
            done();
          });
      });
    });

    describe('current', () => {
      beforeEach(() => {
        sinon.stub(carShows, 'getCurrent').resolves();
      });

      afterEach(() => {
        carShows.getCurrent.restore();
      });

      it('calls the getCurrent method', done => {
        request(app)
          .get('/car-shows/current')
          .end(() => {
            expect(carShows.getCurrent.calledOnce).to.be.true;
            expect(carShows.getCurrent.calledWithExactly()).to.be.true;
            done();
          });
      });

      it('returns an empty object if there is no data', done => {
        request(app)
          .get('/car-shows/current')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('returns the data', done => {
        carShows.getCurrent.resolves({ ...testData[3] });
        request(app)
          .get('/car-shows/current')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(testData[3]);
            done();
          });
      });
    });

    describe('by id', () => {
      beforeEach(() => {
        sinon.stub(carShows, 'get').resolves();
      });

      afterEach(() => {
        carShows.get.restore();
      });

      it('calls the get method', done => {
        request(app)
          .get('/car-shows/42')
          .end(() => {
            expect(carShows.get.calledOnce).to.be.true;
            expect(carShows.get.calledWithExactly('42')).to.be.true;
            done();
          });
      });

      it('returns 404 if there is no data', done => {
        request(app)
          .get('/car-shows/42')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });

      it('returns the data', done => {
        carShows.get.resolves({...testData[3]});
        request(app)
          .get('/car-shows/42')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(testData[3]);
            done();
          });
      });
    });
  });

  describe('post', () => {
    let testCarShow;
    beforeEach(() => {
      testCarShow = {
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
      };

      sinon.stub(carShows, 'save');
    });

    afterEach(() => {
      carShows.save.restore();
    });

    describe('a new show', () => {
      beforeEach(() => {
        carShows.save.resolves({ id: 15, ...testCarShow });
      });

      it('calls the save method', done => {
        request(app)
          .post('/car-shows')
          .send(testCarShow)
          .end(() => {
            expect(carShows.save.calledOnce).to.be.true;
            expect(carShows.save.calledWith(testCarShow)).to.be.true;
            done();
          });
      });

      it('remove the ID if it is present', done => {
        request(app)
          .post('/car-shows')
          .send({ id: 42, ...testCarShow })
          .end(() => {
            expect(carShows.save.calledOnce).to.be.true;
            expect(carShows.save.calledWith(testCarShow)).to.be.true;
            done();
          });
      });

      it('returns the saved item', done => {
        request(app)
          .post('/car-shows')
          .send(testCarShow)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ id: 15, ...testCarShow });
            done();
          });
      });
    });

    describe('an existing show', () => {
      let updatedCarShow;
      beforeEach(() => {
        updatedCarShow = { id: 73, ...testCarShow };
        carShows.save.resolves({ ...updatedCarShow });
      });

      it('calls the save method', done => {
        request(app)
          .post('/car-shows/73')
          .send(updatedCarShow)
          .end(() => {
            expect(carShows.save.calledOnce).to.be.true;
            expect(carShows.save.calledWith(updatedCarShow)).to.be.true;
            done();
          });
      });

      it('favors the ID from the URL', done => {
        request(app)
          .post('/car-shows/42')
          .send(updatedCarShow)
          .end(() => {
            expect(carShows.save.calledOnce).to.be.true;
            expect(carShows.save.calledWith({ ...updatedCarShow, id: 42 })).to
              .be.true;
            done();
          });
      });

      it('returns the updated car show', done => {
        request(app)
          .post('/car-shows/42')
          .send(updatedCarShow)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(updatedCarShow);
            done();
          });
      });

      it('returns 404 if the show did not exist', done => {
        carShows.save.resolves(undefined);
        request(app)
          .post('/car-shows/42')
          .send(updatedCarShow)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  });
});
