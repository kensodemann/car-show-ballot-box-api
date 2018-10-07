'use strict';

const database = require('../config/database');

class CarClasses {
  async getAll() {
    const client = await database.connect();
    const qres = await client.query('select * from car_classes');
    client.release();
    return qres.rows;
  }
};

module.exports = new CarClasses();
