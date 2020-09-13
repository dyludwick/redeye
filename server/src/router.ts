import express from 'express';
import cors from 'cors';
import { authRouter } from './routes';
import RouterUtils from './utils/router';
import { ConfigRouter } from './types';

export default (app: express.Application) => {
  const router = express.Router();
  // Get JSON config
  const { login, routers, whitelist } = app.get('config');

  // Configure CORS
  const corsOptions = {
    origin: (origin: string | undefined, callback: any) => {
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
    router.use(login.path, authRouter(app));
  }
  routers.forEach((configRouter: ConfigRouter) => {
    const dynamicRouter = RouterUtils.generateDynamicRouter(configRouter.routes);
    router.use(configRouter.path, dynamicRouter);
  });

  return router;
};
