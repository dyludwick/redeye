import { Application, Response, Router } from 'express';
import { fetchToken, verifyLogin } from '../middleware/auth';
import { AuthRequest } from '../types';

export default (app: Application) => {
  const router = Router();
  // Get JSON config
  const { login } = app.get('config');
  const database = app.get('database');

  // Login route
  router.post(login.endpoint, verifyLogin(database), fetchToken, (req: AuthRequest, res: Response) => {
    res.json({ token: req.token });
  });

  return router;
};
