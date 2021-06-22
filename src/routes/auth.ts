import { Application, Response, Router } from 'express';
import {
  fetchToken,
  registerUser,
  verifyAuth,
  verifyLogin,
} from '../middleware/auth';
import { AuthRequest, Config, Database } from '../types';

export default (app: Application): Router => {
  const router = Router();
  // Get JSON config
  const { login, register } = app.get('config') as Config;
  const database = app.get('database') as Database;

  // Login route
  router.post(
    login.endpoint,
    // https://stackoverflow.com/questions/67114152/typescript-eslint-throwing-a-promise-returned-error-on-a-express-router-async
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    verifyLogin(database),
    fetchToken,
    (req: AuthRequest, res: Response) => {
      res.json({ token: req.token });
    },
  );

  // Register route
  if (register.enabled) {
    router.post(
      register.endpoint,
      verifyAuth(register),
      registerUser(database),
      (req: AuthRequest, res: Response) => {
        res.status(201).send();
      },
    );
  }

  return router;
};
