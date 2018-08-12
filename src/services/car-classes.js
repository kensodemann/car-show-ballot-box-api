'use strict';

module.exports = class CarClasses {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const qres = await client.query('select * from car_classes');
    client.release();
    return qres.rows;
  }
};
