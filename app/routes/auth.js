'use strict';

var router = require('express').Router();

var seal = require('../lib/seal');
var Auth = require('../lib/Auth');

var objectKeys = Object.keys || require('object-keys');

router.get('/', function root(req, res) {
  res.redirect('login');
});

router.get('/login', function loginPage(req, res) {
  if (req.tokens) {
    return res.redirect(req.config.frontend.rootPath);
  }
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
    password: req.body.password,
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
      if (!user || !objectKeys(user).length) {
        return next(new Error('Expected user to be defined and not empty in Auth API success callback'));
      }

      seal.encode(
        user,
        req.config.seal.secret,
        function callback(err, sealed) {
          if (err || !seal) {
            next(err || new Error('Unexpected Error'));
          }
          res.cookie(req.config.cookie.name, sealed, req.config.cookie.options);
          res.redirect(req.config.frontend.rootPath);
        }
      );
    },
    error: function errorCallback(error) {
      error = error || new Error('Bad gateway');
      if (error.status && error.status >= 400 && error.status < 500) {
        res.status(error.status);
        return res.render('login', { error: 'Username or password invalid' });
      }

      error.status = error.status || 502;
      next(error);
    },
  });
});

router.get('/logout', function logout(req, res) {
  res.clearCookie(req.config.cookie.name);
  //TODO render a temporary confirmation on next rendering
  res.redirect('login');
});

router.get('/recover-password', function recoverPasswordPage(req, res) {
  res.render('test');
});

router.post('/recover-password', function recoverPassword(req, res) {
  res.render('test');
});

router.get('/user-info', function userInfo(req, res) {
  res.json({
    user_id: req.user.user_id,
    username: req.user.username,
  });
});

module.exports = router;
