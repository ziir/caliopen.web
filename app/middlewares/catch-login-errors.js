'use strict';

function catchLoginErrorsMiddleware(err, req, res, next) {
  if (err.status === 401 && ['/login', '/signup', '/'].indexOf(req.path) > -1) {
    return next();
  }

  return next(err);
}

module.exports = catchLoginErrorsMiddleware;
