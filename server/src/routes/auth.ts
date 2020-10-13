import { Application, Response, Router } from 'express';
import { fetchToken, registerUser, verifyAuth, verifyLogin } from '../middleware/auth';
import { AuthRequest } from '../types';

export default (app: Application) => {
  const router = Router();
  // Get JSON config
  const { login, register } = app.get('config');
  const database = app.get('database');

  // Login route
  router.post(
    login.endpoint,
    verifyLogin(database),
    fetchToken,
    (req: AuthRequest, res: Response) => {
      res.json({ token: req.token });
  });

  // Register route
  if (register.enabled) {
    router.post(
      register.endpoint,
      verifyAuth(register),
      registerUser(database),
      (req: AuthRequest, res: Response) => {
        res.status(201).send();
    });
  }

  return router;
};
