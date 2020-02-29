import express from 'express';
import { fetchToken, verifyLogin } from '../middleware/auth';

export default (app) => {
  const router = express.Router();
  // Get JSON config
  const { login } = app.get('config');

  // Login route
  router.post(login.endpoint, verifyLogin, fetchToken, (req, res) => {
    res.json({ token: req.token });
  });
};
