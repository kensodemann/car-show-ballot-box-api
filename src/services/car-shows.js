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
    client.release();
    return merge(qres[0].rows, qres[1].rows);
  }

  async get(id) {
    const client = await this._pool.connect();
    const qres = await Promise.all([
      client.query('select * from car_shows where id = $1', [id]),
      client.query('select * from car_show_classes where car_show_rid = $1', [id])
    ]);
    client.release();
    return merge(qres[0].rows, qres[1].rows)[0];
  }
};

function merge(cars, classes) {
  return cars.map(car => ({
    ...car,
    classes: classes.filter(cls => cls.car_show_rid === car.id)
      .map(cls => {
        delete cls.car_show_rid;
        return cls;
      })
  }));
}
