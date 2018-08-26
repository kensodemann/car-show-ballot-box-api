'use strict';

module.exports = class Votes {
  constructor(pool) {
    this._pool = pool;
  }

  async getAll(year) {
    const client = await this._pool.connect();
    const qres = await (year
      ? client.query('select * from votes where year = $1', [year])
      : client.query('select * from votes'));
    client.release();
    return qres.rows;
  }

  // async get(id) {
  //   const client = await this._pool.connect();
  //   const qres = await client.query(
  //     `select ${columns} from ${tables} where teas.id = $1`,
  //     [id]
  //   );
  //   client.release();
  //   return qres.rows && qres.rows[0];
  // }

  // async save(tea) {
  //   let id = tea.id;
  //   const client = await this._pool.connect();
  //   if (id) {
  //     await client.query(
  //       `update teas set name = $1, tea_category_rid = $2, description = $3, instructions = $4, rating = $5, url = $6, price = $7 where id = $8`,
  //       [
  //         tea.name,
  //         tea.teaCategoryId,
  //         tea.description,
  //         tea.instructions,
  //         tea.rating,
  //         tea.url,
  //         tea.price,
  //         tea.id
  //       ]
  //     );
  //   } else {
  //     const ins = await client.query(
  //       'insert into teas (name, tea_category_rid, description, instructions, rating, url, price) values ($1, $2, $3, $4, $5, $6, $7) returning id',
  //       [
  //         tea.name,
  //         tea.teaCategoryId,
  //         tea.description,
  //         tea.instructions,
  //         tea.rating,
  //         tea.url,
  //         tea.price
  //       ]
  //     );
  //     id = ins.rows && ins.rows[0].id;
  //   }
  //   const qres = await client.query(
  //     `select ${columns} from ${tables} where teas.id = $1`,
  //     [id]
  //   );
  //   client.release();
  //   return qres.rows && qres.rows[0];
  // }

  // async delete(id) {
  //   const client = await this._pool.connect();
  //   await client.query(`delete from tea_purchase_links where tea_rid = $1`, [
  //     id
  //   ]);
  //   await client.query(`delete from teas where id = $1`, [id]);
  //   client.release();
  //   return {};
  // }
};