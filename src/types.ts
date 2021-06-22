// eslint-disable-next-line import/no-duplicates
import type express from 'express';
// eslint-disable-next-line import/no-duplicates
import type { Request } from 'express';
import type { IncomingHttpHeaders } from 'http';
import type mysql from 'mysql';

export type App = express.Application;

export interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  decoded?: object | string;
  headers: IncomingHttpHeaders;
  token?: string;
}

export interface Config {
  id: string;
  login: ConfigLogin;
  register: ConfigRegister;
  routers: ConfigRouter[];
  whitelist: string[];
}

export interface ConfigLogin {
  enabled: boolean;
  endpoint: string;
  path: string;
}

export interface ConfigRegister extends ConfigLogin {
  public: boolean;
}

export interface ConfigRequest {
  auth: ConfigRequestAuth;
  contentTypes: ConfigRequestContentTypes;
  dataPath: Array<string | number>;
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
  'API Key',
}

// export type ConfigRequestAuthTypes = Record<ConfigRequestAuthType, string>

export type ConfigRequestAuthTypes = keyof typeof ConfigRequestAuthType;

enum ConfigRequestAuthMethod {
  'query params',
}

export type ConfigRequestAuthMethods = keyof typeof ConfigRequestAuthMethod;

export interface ConfigRequestContentTypes {
  [index: string]: Array<ContentTypeValues>;
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
  query,
}

export type ConfigRequestParamTypes = keyof typeof ConfigRequestParamType;

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
  put,
}

export type ConfigRouteMethods = keyof typeof ConfigRouteMethod;

enum ConfigRouteType {
  proxy,
}

export type ConfigRouteTypes = keyof typeof ConfigRouteType;

enum ContentTypeValue {
  'application/json',
  'text/html',
  'image/gif',
  'image/jpeg',
  'image/png',
  'application/xml',
  'text/xml',
}

enum ConnectionKey {
  'mysqlConnection',
}

export type ConnectionKeys = keyof typeof ConnectionKey;

export type ContentTypeValues = keyof typeof ContentTypeValue;

export interface Database {
  readonly id: string;
  readonly host: string;
  mysqlConnection?: MySqlConnection | MySqlPool;
  readonly name: string;
  readonly password: string;
  readonly pool: boolean;
  readonly port: number;
  readonly user: string;
}

export interface EnvConfig {
  readonly id: string;
  readonly database: Database;
  readonly port: string;
  readonly proxy: ProxyEnv;
}

export interface ExpressRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/ban-types
  decoded?: object | string;
  headers: IncomingHttpHeaders;
  token?: string;
}

export interface FetchRequestConfig {
  body?: string;
  headers: HeadersInit;
  method: string;
}

export type MySqlConnection = mysql.Connection;

export type MySqlPool = mysql.Pool;

export interface ProxyEnv {
  hosts: { [key: string]: string };
  keys: { [key: string]: string };
}

export interface ProxyRequest extends Request {
  data?: unknown;
}

export interface TokenPayload {
  email: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  [key: string]: unknown;
}
