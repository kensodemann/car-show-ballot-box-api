'use strict';

const Repository = require('./repository');
const CarShowsService = require('../services/car-shows');

module.exports = (app, auth, pool) => {
  const repository = new Repository(new CarShowsService(pool));

  app.get('/car-shows', (req, res) => {
    repository.getAll(req, res);
  });
};
