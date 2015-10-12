var path = require('path');
var fs = require('fs');

var debug = require('debug')('caliopen.web:app');

function readdirAndFilter(path, filterCallback) {
  var files = [];

  try {
    files = fs.readdirSync(path);
  } catch(err) {
    debug(
      'Frontend directory is not available. Style Sheets and brand logo will not be loaded.'
    );
    debug(err);
  }

  var filenames = [];
  files.forEach(function(filename) {
    if(filterCallback(filename)) {
      filenames.push(filename);
    }
  });

  return filenames;
}

module.exports = function frontendConfig(config) {
  var staticFrontendPath = path.resolve(
    __dirname, '..', '..', config.frontend.path, 'dist', 'assets'
  );

  //css
  readdirAndFilter(staticFrontendPath, function(filename) {
    return (
      filename.indexOf('caliopen-frontend') === 0 &&
      filename.indexOf('.css') !== -1 ||
      filename.indexOf('vendor') === 0 &&
      filename.indexOf('.css') !== -1
    );
  }).forEach(function(filename) {
    config.frontend.cssFiles.push('assets/' + filename);
  });

  //brand
  var brandImage = readdirAndFilter(path.resolve(staticFrontendPath, 'images'), function(filename) {
    return filename.indexOf('brand') === 0 && filename.indexOf('.png') !== -1;
  }).shift();

  if (brandImage) {
    config.frontend.brandImage = 'assets/images/' + brandImage;
  }
};
