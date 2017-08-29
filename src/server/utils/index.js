import jwt from 'jsonwebtoken';

export const verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        const err = new Error('failed to authenticate token');
        err.status = 404;
        next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    const err = new Error('no token provided');
    err.status = 403;
    next(err);
  }
};

export const allowedParams = (whitelist) => {
  return function(req, res, next) {
    Object.keys(req.body).map((param) => {
      if (!whitelist.includes(param)) {
        const err = new Error('invalid param(s)');
        err.status = 404;
        next(err);
      }
    });
    next();
  };
};

export const requiredParams = (params) => {
  return function(req, res, next) {
    const validationErrors = [];

    for (const param of params) {
      if (!req.body[param]) {
        validationErrors.push(`${param} is required`);
      }
    }

    if (validationErrors.length > 0) {
      const err = new Error(validationErrors);
      err.status = 404;
      next(err);
    }
    next();
  };
};

export const confirmPassword = function(req, res, next) {
  if (req.body.password && !req.body.password_confirmation) {
    const err = new Error('password_confirmation is required when changing password');
    err.status = 404;
    next(err);
  }

  if (req.body.password !== req.body.password_confirmation) {
    const err = new Error('password and password_confirmation do not match');
    err.status = 404;
    next(err);
  }
  next();
};
