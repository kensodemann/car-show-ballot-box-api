'use strict';

const { Pool } = require('pg');

module.exports = new Pool({ connectionString: process.env.DATABASE_URL || process.env.CAR_SHOW_TEST_DB_URL });
