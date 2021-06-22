import { Router } from 'express';
import cors from 'cors';
import { authRouter } from './routes';
import RouterUtils from './utils/router';
import type { App, Config, ConfigRouter } from './types';

export default (app: App): Router => {
  const router = Router();
  // Get JSON config
  const { login, routers, whitelist } = app.get('config') as Config;

  // Configure CORS
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, origin?: boolean) => void,
    ) => {
      if (whitelist.indexOf(origin || '') !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Origin: ${origin} blocked by CORS`));
      }
    },
  };
  router.use(cors(corsOptions));

  // Mount routing middleware
  if (login.enabled) {
    router.use(login.path, authRouter(app));
  }
  routers.forEach((configRouter: ConfigRouter) => {
    const dynamicRouter = RouterUtils.generateDynamicRouter(
      configRouter.routes,
    );
    router.use(configRouter.path, dynamicRouter);
  });

  return router;
};
