import express from 'express';
import cors from 'cors';
import { authRouter } from './routes';
import RouterUtils from './utils/router';

export default (app) => {
  const router = express.Router();
  // Get JSON config
  const { login, routers, whitelist } = app.get('config');

  // Configure CORS
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Origin: ${origin} blocked by CORS`));
      }
    }
  };
  router.use(cors(corsOptions));

  // Mount routing middleware
  if (login.enabled) {
    router.use(login.path, authRouter);
  }
  routers.forEach((r) => {
    const dynamicRouter = RouterUtils.generateDynamicRouter(r.routes);
    router.use(r.path, dynamicRouter);
  });

  return router;
};
