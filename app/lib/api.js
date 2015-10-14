var http = require('http');
var concat = require('concat-stream');

var ObjectAssign = Object.assign || require('object-assign');
var debug = require('debug')('caliopen.web:app:api-query');

function query(params) {
  var options = ObjectAssign({}, this.defaults || {}, params);

  if (options.body) {
    options.body = JSON.stringify(options.body);
    options.headers['Content-Length'] = Buffer.byteLength(options.body);
  }

  debug('\n','Preparing API query:', '\n', options);

  var req = http.request(options, function queryResponseCallback(res) {
    debug(
      '\n',
      'API query response:',
      '\n',
      res.statusCode,
      res.statusMessage,
      res.headers
    );

    var data;

    res.pipe(concat(function dataCallback(cdata) {
      data = cdata;
    }));

    res.on('end', function endCallback() {
      if (res && res.statusCode >= 200 && res.statusCode < 300) {
        !options.success || options.success(data);
      } else {
        var error = new Error(
          'API Query Error ' + res.statusCode + ' : ' + res.statusMessage
        );
        error.status = res.statusCode;
        !options.error || options.error(error);
      }
    });

  }).on('response', options.response)
    .on('error', options.error);

  if (options.body) {
    req.write(options.body);
  }

  debug('\n','Outgoing API query:', '\n', req);

  req.end();

  return req;
}

module.exports = {
  query: query
};
