const database = require('../../src/config/database');
after(() => database.end());
