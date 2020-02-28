import express from 'express';
import { verifyAuth } from '../middleware/auth';
import { fetchData } from '../middleware/proxy';

class RouterUtils {
  static generateDynamicRouter = (routes) => {
    const router = express.Router();

    routes.forEach((route) => {
      if (route.type === 'proxy') {
        router[route.method](
          route.endpoint,
          verifyAuth(route),
          fetchData(route),
          (req, res) => {
            res.send(req.data);
          }
        );
      }
    });

    return router;
  };
}

export default RouterUtils;
