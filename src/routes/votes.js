'use strict';

const Repository = require('./repository');
const VotesService = require('../services/votes');

module.exports = (app, auth, pool) => {
  const votes = new VotesService(pool);
  const repository = new Repository(votes);

  app.get('/votes', (req, res) => {
    repository.getAll(req, res);
  });

  // app.get('/teas/:id', (req, res) => {
  //   repository.get(req, res);
  // });

  // app.post('/teas/:id', auth.requireApiLogin.bind(auth), (req, res) => {
  //   repository.update(req, res);
  // });

  // app.post('/teas', auth.requireApiLogin.bind(auth), (req, res) => {
  //   repository.insert(req, res);
  // });

  // app.delete('/teas/:id', auth.requireApiLogin.bind(auth), (req, res) => {
  //   repository.delete(req, res);
  // });
};
