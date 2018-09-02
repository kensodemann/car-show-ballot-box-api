'use strict';

const Repository = require('./repository');
const CarShowsService = require('../services/car-shows');

module.exports = (app, auth, pool) => {
  const carShowService = new CarShowsService(pool);
  const repository = new Repository(carShowService);
  const route = '/car-shows';

  app.get(`${route}`, (req, res) => {
    repository.getAll(req, res);
  });

  app.get(`${route}/current`, async (req, res) => {
    try {
      const data = await carShowService.getCurrent();
      if (!data) {
        res.status(404);
        res.end();
      }
      res.send(data);
    } catch (e) {
      console.error(e.stack);
    }
  });

  app.get(`${route}/:id`, (req, res) => {
    repository.get(req, res);
  });

  app.post(`${route}`, (req, res) => {
    repository.insert(req, res);
  });

  app.post(`${route}/:id`, (req, res) => {
    repository.update(req, res);
  });
};
