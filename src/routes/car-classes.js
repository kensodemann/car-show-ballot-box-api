'use strict';

const Repository = require('./repository');
const carClasses = require('../services/car-classes');

module.exports = app => {
  const repository = new Repository(carClasses);

  app.get('/car-classes', (req, res) => {
    repository.getAll(req, res);
  });
};
