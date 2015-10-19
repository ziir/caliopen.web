'use strict';

module.exports = function makeMiddlewares(env) {
  return {
    'exportConfig': require('./export-config')(env),
    'checkCookie': require('./check-cookie'),
    'decodeCookie': require('./decode-cookie'),
    'checkToken': require('./check-token'),
    'catchLoginErrors': require('./catch-login-errors'),
    '404': require('./404'),
    'error': require('./error')(env),
    'frontendRenderer': require('./frontend-renderer'),
  };
};
