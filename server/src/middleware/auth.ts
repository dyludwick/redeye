import { Response, NextFunction } from 'express';
import AuthUtils from '../utils/auth';
import DatabaseUtils from '../utils/database';
import { AuthRequest, ConfigRoute, Database } from '../types';

const fetchToken = (req: AuthRequest, res: Response, next: NextFunction) => {
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

const verifyAuth = (route: ConfigRoute) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (route.public) {
      next();
    } else {
      if (!req.headers['authorization']) {
        res.status(401).send('Unauthorized - invalid token');
      }

      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
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

function verifyLogin(database: Database) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await DatabaseUtils.getUser(database, req.body.email);
      next();
    } catch (err) {
      if (!err.status) {
        err.status = 401;
        err.message = 'Login failed - Invalid username or password';
      }
      next(err);
    }
  }
};

export { fetchToken, verifyAuth, verifyLogin };
