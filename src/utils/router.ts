import { Response, Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import { fetchProxyData } from '../middleware/proxy';
import { ConfigRoute, ConfigRouter, ProxyRequest } from '../types';

class RouterUtils {
  static generateDynamicRouter = (routes: ConfigRouter['routes']) => {
    const router = Router();

    routes.forEach((route: ConfigRoute) => {
      if (route.type === 'proxy') {
        router[route.method](
          route.endpoint,
          verifyAuth(route),
          fetchProxyData(route),
          (req: ProxyRequest, res: Response) => {
            res.send(req.data);
          }
        );
      }
    });

    return router;
  };
}

export default RouterUtils;
