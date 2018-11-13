'use strict';

const database = require('../../src/config/database');
const testData = require('./test-data');

async function removeOldData() {
  await database.query('delete from car_show_ballot_votes');
  await database.query('delete from car_show_ballots');
  await database.query('delete from car_show_classes');
  await database.query('delete from car_shows');
  await database.query('delete from car_classes');
  await database.query('delete from users');
}

function loadClasses() {
  const trans = [];
  testData.classes.forEach(cls => {
    trans.push(
      database.query(
        'insert into car_classes(id, name, description, active) values($1, $2, $3, $4)',
        [cls.id, cls.name, cls.description, cls.active]
      )
    );
  });
  return Promise.all(trans);
}

function loadCarShows() {
  const trans = [];
  testData.carShows.forEach(show => {
    trans.push(
      database.query(
        'insert into car_shows(id, name, date, year) values($1, $2, $3, $4)',
        [show.id, show.name, show.date, show.year]
      )
    );
  });
  trans.push(
    database.query(`select setval('car_shows_id_sequence', $1)`, [
      testData.carShows.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowClasses() {
  const trans = [];
  testData.carShowClasses.forEach(cls => {
    trans.push(
      database.query(
        'insert into car_show_classes(id, name, description, active, car_show_rid) values($1, $2, $3, $4, $5)',
        [cls.id, cls.name, cls.description, cls.active, cls.car_show_rid]
      )
    );
  });
  trans.push(
    database.query(`select setval('car_show_classes_id_sequence', $1)`, [
      testData.carShowClasses.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowBallots() {
  const trans = [];
  testData.carShowBallots.forEach(b => {
    trans.push(
      database.query(
        'insert into car_show_ballots(id, car_show_rid) values($1, $2)',
        [b.id, b.car_show_rid]
      )
    );
  });
  trans.push(
    database.query(`select setval('car_show_ballots_id_sequence', $1)`, [
      testData.carShowBallots.length
    ])
  );
  return Promise.all(trans);
}

function loadCarShowBallotVotes() {
  const trans = [];
  testData.carShowBallotVotes.forEach(v => {
    trans.push(
      database.query(
        'insert into car_show_ballot_votes(id, car_show_class_rid, car_show_ballot_rid, car_number) values($1, $2, $3, $4)',
        [v.id, v.car_show_class_rid, v.car_show_ballot_rid, v.car_number]
      )
    );
  });
  trans.push(
    database.query(`select setval('car_show_ballot_votes_id_sequence', $1)`, [
      testData.carShowBallotVotes.length
    ])
  );
  return Promise.all(trans);
}

function loadUsers() {
  const trans = [];
  testData.users.forEach(u => {
    trans.push(
      database.query(
        'insert into users(id, first_name, last_name, email) values($1, $2, $3, $4)',
        [u.id, u.first_name, u.last_name, u.email]
      )
    );
  });
  trans.push(
    database.query(`select setval('user_id_sequence', $1)`, [
      testData.carShowBallotVotes.length
    ])
  );
  return Promise.all(trans);
}

module.exports = {
  reload: async function() {
    await removeOldData();
    await loadClasses();
    await loadCarShows();
    await loadCarShowClasses();
    await loadCarShowBallots();
    await loadCarShowBallotVotes();
    await loadUsers();
  }
};
