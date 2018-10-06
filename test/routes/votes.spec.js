'use strict';

const auth = require('../../src/services/authentication');
const expect = require('chai').expect;
const express = require('express');
const request = require('supertest');
const votes = require('../../src/services/votes');
const sinon = require('sinon');

describe('route: /votes', () => {
  const app = express();
  require('../../src/config/express')(app);
  require('../../src/routes/votes')(app);

  let testData;

  beforeEach(() => {
    testData = [
      {
        id: 10,
        name: 'Grassy Green',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'something about the tea',
        instructions: 'do something with the tea',
        rating: 2
      },
      {
        id: 20,
        name: 'Moldy Mushroom',
        teaCategoryId: 3,
        teaCategoryName: 'Pu-ehr',
        description:
          'A woody fermented tea with faint hints of mold and fungus',
        instructions: 'soak then brew',
        rating: 5
      },
      {
        id: 30,
        name: 'Earl Grey',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'flowery tea',
        instructions: 'do something with the tea',
        rating: 3
      },
      {
        id: 40,
        name: 'English Breakfast',
        teaCategoryId: 2,
        teaCategoryName: 'Black',
        description: 'Good basic tea',
        instructions: 'brew it hot',
        rating: 4
      },
      {
        id: 1138,
        name: 'Simple Sencha',
        teaCategoryId: 1,
        teaCategoryName: 'Green',
        description: 'Just a good basic green tea',
        instructions: 'do not over-brew',
        rating: 4
      }
    ];
    sinon.stub(auth, 'isAuthenticated').returns(true);
    sinon.stub(votes, 'getAll').returns(testData);
  });

  afterEach(() => {
    auth.isAuthenticated.restore();
    votes.getAll.restore();
  })

  describe('get', () => {
    registerGetTests();

    describe('when not logged in', () => {
      beforeEach(() => {
        auth.isAuthenticated.returns(false);
      });

      registerGetTests();
    });
  });

  function registerGetTests() {
    it('returns the data', done => {
      request(app)
        .get('/votes')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(testData);
          done();
        });
    });
  }
});
