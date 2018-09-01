'use strict';

const express = require('express');
const path = require('path');
const AuthenticationService = require('../services/authentication');

module.exports = (app, pool) => {
  const auth = new AuthenticationService();

  app.use('/', express.static(path.join(__dirname, '/../../dist')));

  require('../routes/athentication')(app, auth);
  require('../routes/car-classes')(app, auth, pool);
  require('../routes/car-shows')(app, auth, pool);
  require('../routes/votes')(app, auth, pool);
  require('../routes/users')(app, auth, pool);
};
