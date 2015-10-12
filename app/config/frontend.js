var path = require('path');
var fs = require('fs');

var debug = require('debug')('caliopen.web:app');


module.exports = function frontendConfig(config) {
  var staticFrontendPath = path.resolve(
    __dirname, '..', '..', config.frontend.path, 'dist', 'assets'
  );
  var files = [];

  try {
    files = fs.readdirSync(staticFrontendPath);
  } catch(err) {
    debug(
      'Frontend directory is not available. Style Sheets will not be loaded.'
    );
    debug(err);
  }

  files.forEach(function(filename) {
    if (
      filename.indexOf('caliopen-frontend') === 0 &&
      filename.indexOf('.css')!== -1 ||
      filename.indexOf('vendor') === 0 &&
      filename.indexOf('.css')!== -1
    ) {
      config.frontend.cssFiles.push(filename);
    }
  });
};
