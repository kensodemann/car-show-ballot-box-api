'use strict';

const Repository = require('./repository');
const CarShowsService = require('../services/car-shows');

module.exports = (app, auth, pool) => {
  const carShowService = new CarShowsService(pool);
  const repository = new Repository(carShowService);

  app.get('/car-shows', (req, res) => {
    repository.getAll(req, res);
  });

  app.get('/car-shows/current', async (req, res) => {
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

  app.get('/car-shows/:id', (req, res) => {
    repository.get(req, res);
  });
};
