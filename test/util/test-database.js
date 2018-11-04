'use strict';

const database = require('../../src/config/database');
const testData = require('./test-data');

async function removeOldData(client) {
  await client.query('delete from car_show_ballot_votes');
  await client.query('delete from car_show_ballots');
  await client.query('delete from car_show_classes');
  await client.query('delete from car_shows');
  await client.query('delete from car_classes');
}

function loadClasses(client) {
  const trans = [];
  testData.classes.forEach(cls => {
    trans.push(
      client.query(
        'insert into car_classes(id, name, description, active) values($1, $2, $3, $4)',
        [cls.id, cls.name, cls.description, cls.active]
      )
    );
  });
  return Promise.all(trans);
}

function loadCarShows(client) {
  const trans = [];
  testData.carShows.forEach(show => {
    trans.push(
      client.query(
        'insert into car_shows(id, name, date, year) values($1, $2, $3, $4)',
        [show.id, show.name, show.date, show.year]
      )
    );
  });
  trans.push(
    client.query(`select setval('car_shows_id_sequence', $1)`, [
      testData.carShows.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowClasses(client) {
  const trans = [];
  testData.carShowClasses.forEach(cls => {
    trans.push(
      client.query(
        'insert into car_show_classes(id, name, description, active, car_show_rid) values($1, $2, $3, $4, $5)',
        [cls.id, cls.name, cls.description, cls.active, cls.car_show_rid]
      )
    );
  });
  trans.push(
    client.query(`select setval('car_show_classes_id_sequence', $1)`, [
      testData.carShowClasses.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowBallots(client) {
  const trans = [];
  testData.carShowBallots.forEach(b => {
    trans.push(
      client.query(
        'insert into car_show_ballots(id, car_show_rid) values($1, $2)',
        [b.id, b.car_show_rid]
      )
    );
  });
  trans.push(
    client.query(`select setval('car_show_ballots_id_sequence', $1)`, [
      testData.carShowBallots.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowBallotVotes(client) {
  const trans = [];
  testData.carShowBallotVotes.forEach(v => {
    trans.push(
      client.query(
        'insert into car_show_ballot_votes(id,car_show_class_rid, car_show_ballot_rid, car_number) values($1, $2, $3, $4)',
        [v.id, v.car_show_class_rid, v.car_show_ballot_rid, v.car_number]
      )
    );
  });
  trans.push(
    client.query(`select setval('car_show_ballot_votes_id_sequence', $1)`, [
      testData.carShowBallotVotes.length
    ])
  );
  return Promise.all(trans);
}

module.exports = {
  reload: async function() {
    const client = await database.connect();
    await removeOldData(client);
    await loadClasses(client);
    await loadCarShows(client);
    await loadCarShowClasses(client);
    await loadCarShowBallots(client);
    await loadCarShowBallotVotes(client);
    client.release();
  }
};
