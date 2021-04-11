import { Response, NextFunction } from 'express';
import AuthUtils from '../utils/auth';
import DatabaseUtils from '../utils/database';
import { AuthRequest, ConfigRoute, Database } from '../types';
import HttpError from '../errors/HttpError';

function fetchToken(req: AuthRequest, res: Response, next: NextFunction) {
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
}

function registerUser(database: Database) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new HttpError(400, 'Bad Request');
    }
    const user = { email, password };

    try {
      const existingUser = await DatabaseUtils.getUser(
        database,
        req.body.email
      );
      if (existingUser) {
        throw new HttpError(409, 'Conflict');
      }
      const hashedUser = await AuthUtils.hashPassword(user);
      await DatabaseUtils.setUser(database, hashedUser);
      next();
    } catch (err) {
      next(err);
    }
  };
}

function verifyAuth(route: ConfigRoute) {
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
}

function verifyLogin(database: Database) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await DatabaseUtils.getUser(database, email);
      if (!user) {
        throw new HttpError(401, 'Invalid username or password');
      }
      const match = await AuthUtils.comparePassword(password, user.password);
      if (!match) {
        throw new HttpError(401, 'Invalid username or password');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export { fetchToken, registerUser, verifyAuth, verifyLogin };
