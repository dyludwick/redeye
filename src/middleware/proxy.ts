import { Response, NextFunction } from 'express';
import fetch, { RequestInit } from 'node-fetch';
import ProxyUtils from '../utils/proxy';
import { logger } from '../config/winston';
import { ConfigRoute, ProxyEnv, ProxyRequest } from '../types';

const fetchProxyData = (route: ConfigRoute) => {
  return async (
    req: ProxyRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const proxyEnv = req.app.get('proxy') as ProxyEnv;
      const url = ProxyUtils.applyParams(
        route.request,
        req.params,
        req.query,
        proxyEnv,
      );
      const config: RequestInit = {
        method: route.method,
        headers: ProxyUtils.applyHeaders(route.request),
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
      logger.error('fetchProxyData failed');
      next(err);
    }
  };
};

// eslint-disable-next-line import/prefer-default-export
export { fetchProxyData };
