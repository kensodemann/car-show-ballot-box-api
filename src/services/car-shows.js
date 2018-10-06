const pool = require('../config/database');

class CarShows {
  async getAll() {
    const client = await pool.connect();
    const qres = await Promise.all([
      client.query('select * from car_shows order by year desc'),
      client.query('select * from car_show_classes')
    ]);
    client.release();
    return merge(qres[0].rows, qres[1].rows);
  }

  async get(id) {
    const client = await pool.connect();
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
    const client = await pool.connect();
    const year = new Date().getFullYear();
    const showsRes = await client.query(
      'select * from car_shows where year = $1',
      [year]
    );
    if (showsRes.rows && showsRes.rows.length) {
      classesRes = await client.query(
        'select * from car_show_classes where car_show_rid = $1',
        [showsRes.rows[0].id]
      );
    }
    client.release();
    return merge(showsRes.rows, (classesRes && classesRes.rows) || [])[0];
  }

  async save(show) {
    let id = show.id;
    const client = await pool.connect();
    if (id) {
      await client.query(
        'update car_shows set name = $1, date = $2, year = $3 where id = $4',
        [show.name, show.date, show.year, show.id]
      );
    } else {
      const ret = await client.query(
        'insert into car_shows (name, date, year) values ($1, $2, $3) returning id',
        [show.name, show.date, show.year]
      );
      id = ret.rows && ret.rows[0].id;
    }
    await saveCarShowClasses(client, show.classes, id);
    const qres = await Promise.all([
      client.query('select * from car_shows where id = $1', [id]),
      client.query('select * from car_show_classes where car_show_rid = $1', [
        id
      ])
    ]);
    client.release();
    return merge(qres[0].rows, qres[1].rows)[0];
  }
};

function saveCarShowClasses(client, classes, carShowId) {
  let qres = [];
  classes.forEach(cls => {
    if (cls.id) {
      qres.push(
        client.query(
          'update car_show_classes set name = $1, description = $2, active = $3, car_show_rid = $4 where id = $5',
          [cls.name, cls.description, cls.active, carShowId, cls.id]
        )
      );
    } else {
      qres.push(
        client.query(
          'insert into car_show_classes (name, description, active, car_show_rid) values ($1, $2, $3, $4)',
          [cls.name, cls.description, cls.active, carShowId]
        )
      );
    }
  });
  return Promise.all(qres);
}

function merge(shows, classes) {
  return shows.map(show => ({
    ...show,
    classes: classes.filter(cls => cls.car_show_rid === show.id).map(cls => {
      delete cls.car_show_rid;
      return cls;
    })
  }));
}

module.exports = new CarShows();
