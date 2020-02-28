import AuthUtils from '../utils/auth';
import DatabaseUtils from '../utils/database';

const fetchToken = (req, res, next) => {
  const payload = {
    email: req.body.Email,
    auth: req.kovaToken
  };

  try {
    const token = AuthUtils.signToken(payload);
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};

const verifyAuth = (route) => {
  return async (req, res, next) => {
    if (route.public) {
      next();
    } else {
      if (!req.headers.authorization) {
        res.status(401).send('Unauthorized - invalid token');
      }

      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = AuthUtils.verifyToken(token);
        req.decoded = decoded;
        next();
      } catch (err) {
        if (!err.status) {
          err.status = 401;
        }
        next(err);
      }
    }
  };
};

const verifyLogin = async (req, res, next) => {
  try {
    const user = await DatabaseUtils.getUser(req.body.email);
    console.dir(user);
    next();
  } catch (err) {
    if (!err.status) {
      err.status = 401;
      err.message = 'Login failed - Invalid username or password';
    }
    next(err);
  }
};

export { fetchToken, verifyAuth, verifyLogin };
