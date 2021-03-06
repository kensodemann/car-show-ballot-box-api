'use strict';

const encryption = require('./encryption');
const database = require('../config/database');

class Password {
  async initialize(id, password) {
    const reject =
      this._missingParam(id, 'id') || this._missingParam(password, 'password');
    if (reject) {
      return reject;
    }

    const client = await database.connect();
    const data = await this._getCredentials(client, id);
    if (data) {
      return Promise.reject(new Error('Password already initialized'));
    }

    await this._updateCredentials(client, id, password);

    client.release();
  }

  async change(id, password, currentPassword) {
    const reject =
      this._missingParam(id, 'id') || this._missingParam(password, 'password');
    if (reject) {
      return reject;
    }

    const client = await database.connect();
    if (!await this._passwordMatches(client, id, currentPassword)) {
      return Promise.reject(new Error('Invalid password'));
    }

    await this._updateCredentials(client, id, password);

    client.release();
  }

  async matches(id, password) {
    const client = await database.connect();
    const m = this._passwordMatches(client, id, password);
    client.release();
    return m;
  }

  async _passwordMatches(client, id, password) {
    const cred = await this._getCredentials(client, id);
    return !!(cred && cred.password === encryption.hash(cred.salt, password));
  }

  async _getCredentials(client, id) {
    const data = await client.query(
      'select * from user_credentials where user_rid = $1',
      [id]
    );
    return data.rows && data.rows[0];
  }

  _missingParam(p, name) {
    if (!p) {
      return Promise.reject(new Error(`Missing Parameter: ${name}`));
    }
  }

  _updateCredentials(client, id, password) {
    const salt = encryption.salt();
    const hash = encryption.hash(salt, password);

    return client.query(
      `insert into user_credentials (user_rid, password, salt)
       values ($1, $2, $3)
       on conflict (user_rid) do update
       set password = $2, salt = $3`,
      [id, hash, salt]
    );
  }
};

module.exports = new Password();
