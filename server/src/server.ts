import app from './app';
import { Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import router from './router';
import { logger } from './config/winston';
import DatabaseUtils from './utils/database';
import { Database, EnvConfig, Proxy } from './types';

class Server {
  configId: string;
  database: Database | undefined;
  port: number;
  proxy: Proxy | undefined;
  server: http.Server | null;
  constructor(config: EnvConfig) {
    this.configId = config.id;
    this.database = config.database;
    this.port = config.port ? parseInt(config.port) : 8080;
    this.proxy = config.proxy;
    this.server = null;
  }

  init = () => {
    // Init server
    const server = http.createServer(app);

    // Set env config
    app.set('database', this.database);
    app.set('proxy', this.proxy);
    // Get & set JSON config
    try {
      const config = this.getConfiguration();
      app.set('config', config);
    } catch (err) {
      logger.error(
        `JSON configuration not found
        ${err}`
      );
    }

    // Mount routing middleware
    app.use(router(app));

    // Init error handling
    // eslint-disable-next-line no-unused-vars
    app.use((err: any, req: Request, res: Response) => {
      logger.error(
        `Error: ${err.status || 500} -
        Message: ${err.message}`
      );
      res.status(err.status || 500).send(err.message);
    });

    // Connect Database
    if (this.database) {
      DatabaseUtils.initDB(this.database);
    }

    this.server = server;
  };

  getConfiguration = () => {
    const jsonPath = path.join(
      __dirname,
      '..',
      'json',
      `${this.configId}.json`
    );
    const config = JSON.parse(fs.readFileSync(jsonPath).toString());
    return config;
  };

  listen = () => {
    this.server?.listen(this.port, () =>
      logger.info(`RedEye listening on port ${this.port}!`)
    );
  };
}

export default Server;