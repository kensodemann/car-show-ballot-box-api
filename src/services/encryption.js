'use strict';

const crypto = require('crypto');

class EncryptionService {
  salt() {
    return crypto.randomBytes(128).toString('base64');
  }

  hash(salt, password) {
    const hmac = crypto.createHmac('sha1', salt);
    return hmac.update(password).digest('hex');
  }
};

module.exports = new EncryptionService();
