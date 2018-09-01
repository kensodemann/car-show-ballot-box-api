module.exports = class CarShows {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll() {
    const client = await this._pool.connect();
    const qres = await Promise.all([
      client.query('select * from car_shows order by year desc'),
      client.query('select * from car_show_classes')
    ]);
    const cars = qres[0].rows.map(car => ({
      ...car,
      classes: qres[1].rows
        .filter(cls => cls.car_show_rid === car.id)
        .map(cls => {
          delete cls.car_show_rid;
          return cls;
        })
    }));
    client.release();
    return cars;
  }
};
