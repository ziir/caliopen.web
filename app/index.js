'use strict';

var path          = require('path');

var express       = require('express');
var logger        = require('morgan');
var debug         = require('debug')('caliopen.web:app');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var nunjucks      = require('nunjucks');

var app           = express();

var middlewares   = require('./middlewares')(app.get('env'));
var routes        = require('./routes');


app.use(logger('dev'));

// view engine setup
app.set('view engine', 'html');
// Nunjucks options
// See https://mozilla.github.io/nunjucks/api.html#configure
nunjucks.configure(path.resolve(__dirname, 'views'), {
  autoescape: true,
  watch: (app.get('env') === 'development'),
  express: app,
});

// FIXME: Use config
// Serve frontend app from caliopen/frontend/dist
var staticAppPath = path.resolve(__dirname, '..', '..', 'frontend', 'dist');
// FIXME: Use config
debug(
	'Registering static frontend app at ',
	staticAppPath,
	'to be served under /app'
);
app.use('/app', express.static(staticAppPath));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(middlewares.exportConfig);

app.get('/', function redirectToLogin(req, res) {
  res.redirect('/auth/login');
});

app.use(['/api', '/auth'],
  middlewares.checkCookie,
  middlewares.decodeCookie,
  middlewares.checkToken
);

app.use('/api', routes.api);

app.use(['/auth/login', '/auth/signup'], middlewares.catchLoginErrors);

app.use('/auth', middlewares.frontendRenderer, routes.auth);

// catch 404 and forward to error handler
app.use(middlewares['404']);
// error handler
app.use(middlewares.error);

module.exports = app;
