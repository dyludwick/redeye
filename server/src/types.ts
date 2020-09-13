import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface AuthRequest extends Request {
  decoded?: object | string;
  headers: IncomingHttpHeaders;
  kovaToken?: string;
  token?: string;
}

export interface ConfigRequest {
  auth: ConfigRequestAuth;
  contentTypes: ConfigRequestContentTypes;
  dataPath: Array<string>;
  envHostname: string;
  headers: Array<ConfigRequestHeader>;
  params: Array<ConfigRequestParam>;
  url: string;
}

export interface ConfigRequestAuth {
  envKey: string;
  key: string;
  method: ConfigRequestAuthMethods;
  type: ConfigRequestAuthTypes;
}

enum ConfigRequestAuthType {
  'API Key'
}

// export type ConfigRequestAuthTypes = Record<ConfigRequestAuthType, string>

export type ConfigRequestAuthTypes = keyof typeof ConfigRequestAuthType

enum ConfigRequestAuthMethod {
  'query params'
}

export type ConfigRequestAuthMethods = keyof typeof ConfigRequestAuthMethod

export interface ConfigRequestContentTypes {
  [index: string]: Array<ContentTypeValues>
  html: Array<ContentTypeValues>;
  img: Array<ContentTypeValues>;
  json: Array<ContentTypeValues>;
  xml: Array<ContentTypeValues>;
}

export interface ConfigRequestHeader {
  key: string;
  value: string;
}

export interface ConfigRequestParam {
  name: string;
  type: ConfigRequestParamTypes;
}

enum ConfigRequestParamType {
  route,
  query
}

export type ConfigRequestParamTypes = keyof typeof ConfigRequestParamType

export interface ConfigRoute {
  endpoint: string;
  method: ConfigRouteMethods;
  public: boolean;
  request: ConfigRequest;
  type: ConfigRouteTypes;
}

export interface ConfigRouter {
  path: string;
  routes: Array<ConfigRoute>;
}

enum ConfigRouteMethod {
  delete,
  get,
  patch,
  post,
  put
}

export type ConfigRouteMethods = keyof typeof ConfigRouteMethod

enum ConfigRouteType {
  proxy
}

export type ConfigRouteTypes = keyof typeof ConfigRouteType

enum ContentTypeValue {
  'application/json',
  'text/html',
  'image/gif',
  'image/jpeg',
  'image/png',
  'application/xml',
  'text/xml'
}

export type ContentTypeValues = keyof typeof ContentTypeValue

export interface Database {
  readonly id: string;
  readonly host: string;
  readonly name: string;
  readonly password: string;
  readonly port: number;
  readonly user: string;
}

export interface EnvConfig {
  readonly id: string;
  readonly database: Database;
  readonly port: string;
  readonly proxy: Proxy;
}

export interface ExpressRequest extends Request {
  decoded?: object;
  headers: IncomingHttpHeaders;
  kovaToken?: string;
  token?: string;
}

export interface FetchRequestConfig {
  body?: string;
  headers: HeadersInit;
  method: string;
}

export interface Proxy {
  hosts: { [key: string]: string };
  keys: { [key: string]: string };
}

export interface ProxyRequest extends Request {
  data?: any;
}
