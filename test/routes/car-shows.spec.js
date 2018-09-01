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

  class MockCarShowsService {
    getAll() {
      return Promise.resolve(testData);
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
    ];
    proxyquire('../../src/routes/car-shows', {
      '../services/car-shows': MockCarShowsService
    })(app, auth, pool);
  });

  describe('get', () => {
    it('returns the data', done => {
      request(app)
        .get('/car-shows')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });
  });
});
