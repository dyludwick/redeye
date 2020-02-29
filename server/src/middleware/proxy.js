import fetch from 'node-fetch';
import ProxyUtils from '../utils/proxy';
import logger from '../config/winston';

const fetchData = (route) => {
  return async (req, res, next) => {
    try {
      const proxyEnv = req.app.get('proxy');
      const url = ProxyUtils.applyParams(
        route.request,
        req.params,
        req.query,
        proxyEnv
      );
      const config = {
        method: route.method,
        headers: ProxyUtils.applyHeaders(route.request, req.query)
      };

      if (
        route.method === 'post' ||
        route.method === 'patch' ||
        route.method === 'put'
      ) {
        config.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, config);
      const data = await ProxyUtils.parseData(route, response);
      req.data = data;

      next();
    } catch (err) {
      logger.error('fetchData failed');
      next(err);
    }
  };
};

export { fetchData };
