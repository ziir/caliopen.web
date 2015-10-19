'use strict';

var cyphered = require('../lib/seal');

function decodeCookie(req, res, next) {
  var seal = req.seal;

  cyphered.decode(seal, req.config.seal.secret, function afterDecode(err, obj) {
    if (err || !obj) {
      var error = new Error('Unexpected Server Error');
      error.status = 500;
      error.err = err;

      return next(error);
    } else {
      req.user = obj;
    }

    return next();
  });
}

module.exports = decodeCookie;
