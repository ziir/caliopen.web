module.exports = function frontendRendererMiddleware(req, res, next) {

  res.locals.head = {
    cssFiles: req.config.frontend.cssFiles
  };

  return next();
};
