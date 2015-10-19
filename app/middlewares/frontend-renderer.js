'use strict';

module.exports = function frontendRendererMiddleware(req, res, next) {

  res.locals.head = {
    cssFiles: req.config.frontend.cssFiles,
  };
  res.locals.body = {
    brandImage: req.config.frontend.brandImage,
  };

  return next();
};
