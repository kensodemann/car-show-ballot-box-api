'use strict';

const expect = require('chai').expect;
const database = require('../../src/config/database');
const service = require('../../src/services/ballots');
const testData = require('../util/test-data');
const testDatabase = require('../util/test-database');

describe('service: car-show-ballots', () => {
  before(async () => {
    await testDatabase.reload();
  });

  afterEach(() => {
    expect(database.idleCount).to.equal(database.totalCount);
  });

  describe('getAll', () => {
    describe('without an id', () => {
      it('returns a list of ballots', async () => {
        const data = await service.getAll();
        expect(data.length).to.equal(testData.carShowBallots.length);
      });

      it('returns the votes for each ballot', async () => {
        const data = await service.getAll();
        data.forEach(ballot => {
          const votes = testData.carShowBallotVotes.filter(
            v => v.car_show_ballot_rid === ballot.id
          );
          expect(ballot.votes.length).to.equal(votes.length);
        });
      });
    });

    describe('with an id', () => {
      it('returns a list of ballots', async () => {
        const data = await service.getAll(2);
        const expected = testData.carShowBallots.filter(
          b => b.car_show_rid === 2
        );
        expect(data.length).to.equal(expected.length);
        data.forEach(element => {
          expect(element.carShowId).to.equal(2);
        });
      });

      it('returns the votes for each ballot', async () => {
        const data = await service.getAll(3);
        data.forEach(ballot => {
          const votes = testData.carShowBallotVotes.filter(
            v => v.car_show_ballot_rid === ballot.id
          );
          expect(ballot.votes.length).to.equal(votes.length);
        });
      });
    });
  });
});
