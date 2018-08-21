'use strict';

module.exports = (app, auth) => {
  app.post('/login', auth.authenticate.bind(auth));

  app.post('/logout', (req, res) => {
    req.logout();
    res.end();
  });
};
