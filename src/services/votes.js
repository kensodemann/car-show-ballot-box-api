'use strict';

const database = require('../config/database');

class Votes {
  async getAll(year) {
    const client = await database.connect();
    const qres = await (year
      ? client.query('select * from votes where year = $1', [year])
      : client.query('select * from votes'));
    client.release();
    return qres.rows;
  }
};

module.exports = new Votes();
