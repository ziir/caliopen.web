'use strict';

function makeErrorMiddleware(env) {
  return function errorMiddleware(err, req, res) {
    err.status = err.status || 500;
    res.status(err.status);

    var isDev = env === 'development';

    var publicError = {
      status: err.status,
      message: err.message,
      error: isDev ? err : {},
      stack: isDev ? err.stack : '',
    };

    if (req.accepts('html')) {
      if (err.status === 401) {
        // FIXME : Use config
        var redirectTo = '/auth/login?redirect'+req.originalUrl.split('?')[0];
        res.redirect(redirectTo);
        return;
      }

      res.render('error', publicError);
    } else if (req.accepts('json')) {
      res.json(publicError);
    }
  };
}

module.exports = makeErrorMiddleware;
