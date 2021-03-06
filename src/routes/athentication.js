'use strict';

const auth = require('../services/authentication');

module.exports = (app) => {
  app.post('/login', auth.authenticate.bind(auth));

  app.post('/logout', auth.deauthenticate.bind(auth), (req, res) => {
    req.logout();
    res.end();
  });
};
