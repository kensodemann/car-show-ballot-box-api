'use strict';

const expect = require('chai').expect;
const express = require('express');
const MockPool = require('../mocks/mock-pool');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /car-classes', () => {
  let app;
  let testData;

  let getAllStub;
  let getCurrentStub;
  let getStub;
  let saveStub;

  class MockCarShowsService {
    constructor() {
      this.getAll = getAllStub;
      this.get = getStub;
      this.getCurrent = getCurrentStub;
      this.save = saveStub;
    }
  }

  beforeEach(() => {
    const mockJWT = {};
    const AuthService = proxyquire('../../src/services/authentication', {
      jsonwebtoken: mockJWT
    });
    sinon.stub(mockJWT, 'verify');
    mockJWT.verify.returns({
      id: 1138,
      firstName: 'Ted',
      lastName: 'Senspeck',
      roles: ['admin'],
      iat: 'whatever',
      exp: 19930124509912485
    });
    const auth = new AuthService();

    app = express();
    require('../../src/config/express')(app);
    const pool = new MockPool();
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
    getAllStub = sinon.stub().returns(Promise.resolve([]));
    getCurrentStub = sinon.stub().returns(Promise.resolve());
    getStub = sinon.stub().returns(Promise.resolve());
    saveStub = sinon.stub().returns(Promise.resolve());
    proxyquire('../../src/routes/car-shows', {
      '../services/car-shows': MockCarShowsService
    })(app, auth, pool);
  });

  describe('get', () => {
    describe('all', () => {
      it('calls the getAll method', done => {
        request(app)
          .get('/car-shows')
          .end(() => {
            expect(getAllStub.calledOnce).to.be.true;
            expect(getAllStub.calledWithExactly()).to.be.true;
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
        getAllStub.returns(testData);
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
      it('calls the getCurrent method', done => {
        request(app)
          .get('/car-shows/current')
          .end(() => {
            expect(getCurrentStub.calledOnce).to.be.true;
            expect(getCurrentStub.calledWithExactly()).to.be.true;
            done();
          });
      });

      it('returns 404 if there is no data', done => {
        request(app)
          .get('/car-shows/current')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });

      it('returns the data', done => {
        getCurrentStub.returns(testData[3]);
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
      it('calls the get method', done => {
        request(app)
          .get('/car-shows/42')
          .end(() => {
            expect(getStub.calledOnce).to.be.true;
            expect(getStub.calledWithExactly('42')).to.be.true;
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
        getStub.returns(testData[3]);
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

      saveStub.returns({ id: 15, ...testCarShow });
    });

    describe('a new show', () => {
      it('calls the save method', done => {
        request(app)
          .post('/car-shows')
          .send(testCarShow)
          .end(() => {
            expect(saveStub.calledOnce).to.be.true;
            expect(saveStub.calledWith(testCarShow)).to.be.true;
            done();
          });
      });

      it('remove the ID if it is present', done => {
        request(app)
          .post('/car-shows')
          .send({ id: 42, ...testCarShow })
          .end(() => {
            expect(saveStub.calledOnce).to.be.true;
            expect(saveStub.calledWith(testCarShow)).to.be.true;
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
        saveStub.returns(updatedCarShow);
      });

      it('calls the save method', done => {
        request(app)
          .post('/car-shows/73')
          .send(updatedCarShow)
          .end(() => {
            expect(saveStub.calledOnce).to.be.true;
            expect(saveStub.calledWith(updatedCarShow)).to.be.true;
            done();
          });
      });

      it('favors the ID from the URL', done => {
        request(app)
          .post('/car-shows/42')
          .send(updatedCarShow)
          .end(() => {
            expect(saveStub.calledOnce).to.be.true;
            expect(saveStub.calledWith({ ...updatedCarShow, id: 42 })).to.be
              .true;
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
        saveStub.returns(undefined);
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
