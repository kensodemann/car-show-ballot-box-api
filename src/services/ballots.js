'use strict';

const database = require('../config/database');

class Ballots {
  getBallots(carShowId) {
    const params = [];
    let sql = 'select id, car_show_rid as "carShowId" from car_show_ballots';
    if (carShowId) {
      sql += ' where car_show_rid = $1';
      params.push(carShowId);
    }
    return database.query(sql, params);
  }

  getBallotVotes(carShowId) {
    const params = [];
    let sql =
      'select car_show_ballot_votes.id, car_show_ballot_votes.car_show_class_rid as "carShowClassId",' +
      ' car_show_ballot_votes.car_number as "carNumber", car_show_ballot_votes.car_show_ballot_rid' +
      ' from car_show_ballots join car_show_ballot_votes on car_show_ballot_votes.car_show_ballot_rid = car_show_ballots.id';
    if (carShowId) {
      sql += ' where car_show_ballots.car_show_rid = $1';
      params.push(carShowId);
    }
    return database.query(sql, params);
  }

  mergeData(ballots, votes) {
    ballots.forEach(ballot => {
      ballot.votes = votes
        .filter(vote => vote.car_show_ballot_rid === ballot.id)
        .map(vote => ({
          id: vote.id,
          carShowClassId: vote.carShowClassId,
          carNumber: vote.carNumber
        }));
    });
  }

  async getAll(carShowId) {
    const queries = [
      this.getBallots(carShowId),
      this.getBallotVotes(carShowId)
    ];
    const results = await Promise.all(queries);
    this.mergeData(results[0].rows, results[1].rows);
    return results[0].rows;
  }
}

module.exports = new Ballots();
