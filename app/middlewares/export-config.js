'use strict';

var config;

function exportConfig(req, res, next) {
  req.config = config;
  next();
}


module.exports = function makeExportConfig(env) {
  config = require('../config')(env);
  return exportConfig;
};
