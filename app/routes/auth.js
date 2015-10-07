var router = require('express').Router();

var seal = require('../lib/seal');
var Auth = require('../lib/Auth');

var objectKeys = Object.keys || require('object-keys');

router.get('/', function root(req, res, next) {
  res.redirect('/login');
});

router.get('/login', function loginPage(req, res, next) {
  res.render('login');
});

router.post('/login', function login(req, res, next) {
  var auth = new Auth(req.config);

  if (!req.body || !objectKeys(req.body).length) {
    var err = new Error('Bad request');
    err.status = 400;

    throw err;
  }

  var values = {
    username: req.body.username,
    password: req.body.password
  };

  if (!values.username || !values.password) {
    return res.render('login', { error: 'Username or password invalid' });
  }

  auth.authenticate({
    username: values.username,
    password: values.password,

    response: function responseCallback(response) {
      if (req.accepts('json')) {
        res.status(response.statusCode);
      }
    },
    success: function successCallback(user) {
      seal.encode(
        user,
        req.config.seal.secret,
        function callback(err, sealed) {
          if (err || !seal) {
            next(err || new Error('Unexpected Error'));
          }
          res.cookie(req.config.cookie.name, sealed, req.config.cookie.options);
        }
      );
    },
    error: function errorCallback(error) {
      error = error || new Error('Bad gateway');
      error.status = 502;
      next(error);
    }
  });
});

router.get('/logout', function logout(req, res, next) {
  res.clearCookie(req.config.cookie.name);
  res.render('login', { loggedOut: true });
});

router.get('/recover-password', function recoverPasswordPage(req, res, next) {
  res.render('test');
});

router.post('/recover-password', function recoverPassword(req, res, next) {
  res.render('test');
});

module.exports = router;
