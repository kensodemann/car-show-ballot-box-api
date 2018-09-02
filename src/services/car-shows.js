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
      client.query('select * from car_show_classes where car_show_rid = $1', [
        id
      ])
    ]);
    client.release();
    return merge(qres[0].rows, qres[1].rows)[0];
  }

  async getCurrent() {
    let classesRes;
    const client = await this._pool.connect();
    const year = new Date().getFullYear();
    const showsRes = await client.query('select * from car_shows where year = $1', [
      year
    ]);
    if (showsRes.rows && showsRes.rows.length) {
      classesRes = await client.query(
        'select * from car_show_classes where car_show_rid = $1',
        [showsRes.rows[0].id]
      );
    }
    client.release();
    return merge(showsRes.rows, (classesRes && classesRes.rows) || [])[0];
  }
};

function merge(shows, classes) {
  return shows.map(show => ({
    ...show,
    classes: classes.filter(cls => cls.car_show_rid === show.id).map(cls => {
      delete cls.car_show_rid;
      return cls;
    })
  }));
}
