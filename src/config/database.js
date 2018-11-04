'use strict';

const { Pool } = require('pg');
const connectString =
  process.env.DATABASE_URL || process.env.CAR_SHOW_TEST_DB_URL;

if (!connectString) {
  throw new Error(
    'No connect string. Be sure to set DATABASE_URL in the server environment or CAR_SHOW_TEST_DB_URL for unit tests.'
    + ' If running locally, be sure to use "heroku local web" to get DATABASE_URL from .env file.'
  );
}

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.CAR_SHOW_TEST_DB_URL
});
