'use strict';

var path = require('path');
var YAML = require('yamljs');

module.exports = function envConfig(env) {
  var filename;

  if (env === 'production') {
    filename = 'production.yaml';
  } else {
    filename = 'development.yaml';
  }

  return YAML.load(path.resolve(__dirname, '..', '..', filename));
};
