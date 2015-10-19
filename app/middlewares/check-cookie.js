'use strict';

function checkCookie(req, res, next) {
  var cookie = req.cookies && req.cookies[req.config.cookie.name];

  if (!cookie) {
    var error = new Error('Unauthorized');
    error.status = 401;

    return next(error);
  }

  req.seal = cookie;

  next();
}

module.exports = checkCookie;
