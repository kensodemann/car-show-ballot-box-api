'use strict';

const Repository = require('./repository');
const CarClassesService = require('../services/car-classes');

module.exports = (app, auth, pool) => {
  const repository = new Repository(new CarClassesService(pool));

  app.get('/car-classes', (req, res) => {
    repository.getAll(req, res);
  });
};
