'use strict';

const pool = require('../config/database');

class CarClasses {
  async getAll() {
    const client = await pool.connect();
    const qres = await client.query('select * from car_classes');
    client.release();
    return qres.rows;
  }
};

module.exports = new CarClasses();
