'use strict';

const Repository = require('./repository');
const votes = require('../services/votes');

module.exports = (app) => {
  const repository = new Repository(votes);

  app.get('/votes', (req, res) => {
    repository.getAll(req, res);
  });
};
