'use strict';

const carClasses = require('../../src/services/car-classes');
const expect = require('chai').expect;
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');

describe('route: /car-classes', () => {
  const app = express();
  require('../../src/config/express')(app);
  require('../../src/routes/car-classes')(app);
  let testData;

  beforeEach(() => {
    testData = [
      {
        id: 1,
        name: 'Green',
        description: 'Non - oxidized, mild tea'
      },
      {
        id: 2,
        name: 'Black',
        description: 'Oxidized tea'
      },
      {
        id: 3,
        name: 'Herbal',
        description: 'Not a tea'
      }
    ];
    sinon.stub(carClasses, 'getAll').resolves([]);
  });

  afterEach(() => carClasses.getAll.restore());

  describe('get', () => {
    it('returns the data', done => {
      carClasses.getAll.resolves([...testData]);
      request(app)
        .get('/car-classes')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });
  });
});
