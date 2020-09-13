import { Request } from 'express';
import { HeadersInit, Response } from 'node-fetch';
import { ConfigRequest, ConfigRequestContentTypes, ConfigRoute, Proxy } from '../types';

class ProxyUtils {
  static applyDataPath = (data: any, dataPath: ConfigRequest['dataPath']) => {
    let result = data;

    dataPath.forEach((path) => {
      result = result[path];
    });

    return result;
  };

  static applyHeaders = (request: ConfigRequest) => {
    if (request.headers.length > 0) {
      const headers: HeadersInit = {};
      request.headers.forEach((header) => {
        headers[header.key] = header.value;
      });

      return headers;
    }

    return undefined;
  };

  static applyParams = (proxyRequest: ConfigRequest, reqParams: Request['params'], reqQuery: Request['query'], proxyEnv: Proxy) => {
    const env = reqQuery.env ? reqQuery.env : 'DEV';
    const { envHostname } = proxyRequest;
    const url: string =
      env === 'PROD'
        ? proxyEnv.hosts[`${envHostname}_PROD`]
        : proxyEnv.hosts[`${envHostname}_DEV`];
    let result = `${url}${proxyRequest.url}`;

    if (proxyRequest.params) {
      proxyRequest.params.forEach((param) => {
        if (param.type === 'route') {
          result = result.replace(
            `$${param.name}$`,
            `${reqParams[param.name]}`
          );
        }
        if (param.type === 'query') {
          result = result.replace(`$${param.name}$`, `${reqQuery[param.name]}`);
        }
      });
    }

    if (proxyRequest.auth.method === 'query params') {
      const { envKey, key } = proxyRequest.auth;
      const apiKey =
        env === 'PROD'
          ? proxyEnv.keys[`${envKey}_PROD`]
          : proxyEnv.keys[`${envKey}_DEV`];
      result = `${result}&${key}=${apiKey}`;
    }

    return result;
  };

  // static paramExists = (param, obj) => {
  //   return param.required && obj[param];
  // };

  static parseData = async (route: ConfigRoute, response: Response) => {
    const contentType = response.headers.get('Content-Type');
    const contentTypeOverrides = route.request.contentTypes;
    let dataFormat;
    let data;

    const defaultContentTypes: ConfigRequestContentTypes = {
      json: ['application/json'],
      html: ['text/html'],
      img: ['image/gif', 'image/jpeg', 'image/png'],
      xml: ['application/xml', 'text/xml']
    };

    if (contentTypeOverrides) {
      Object.keys(contentTypeOverrides).forEach((key) => {
        contentTypeOverrides[key].forEach((header) => {
          if (contentType?.indexOf(header) !== -1) {
            dataFormat = key;
          }
        });
      });
    }
    if (!dataFormat) {
      Object.keys(defaultContentTypes).forEach((key) => {
        defaultContentTypes[key].forEach((header) => {
          if (contentType?.indexOf(header) !== -1) {
            dataFormat = key;
          }
        });
      });
    }

    if (dataFormat === 'json') {
      data = await response.json();
      if (route.request.dataPath.length > 0) {
        data = ProxyUtils.applyDataPath(data, route.request.dataPath);
      }
    }
    if (dataFormat === 'img') {
      data = await response.blob();
    }
    if (dataFormat === 'html' || dataFormat === 'xml' || !dataFormat) {
      data = await response.text();
    }

    return data;
  };
}

export default ProxyUtils;
