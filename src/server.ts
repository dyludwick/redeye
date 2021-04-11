import app from './app';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import router from './router';
import { logger } from './config/winston';
import DatabaseUtils from './utils/database';
import { Database, EnvConfig, Proxy } from './types';
import {
  createHttpTerminator,
} from 'http-terminator';

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

  init = async () => {
    // Init server
    const server = http.createServer(app);

    // Set env config
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

    // Connect Database
    if (this.database) {
      await DatabaseUtils.initDB(app, this.database);
    }

    // Mount routing middleware
    app.use(router(app));

    // Init error handling
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.error(
        `Error: ${err.status || 500} -
        Message: ${err.message}`
      );
      res.status(err.status || 500).send(err.message);
    });

    this.server = server;
    return server;
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

  listen = async (server: http.Server) => {
    await this.server?.listen(this.port, () =>
      logger.info(`RedEye listening on port ${this.port}!`)
    );
    process.on('SIGINT', async function() {
      console.log('yo');
      // Dylan is a huge tool
      // server.close();
      const httpTerminator = createHttpTerminator({
        server,
      });
      
      await httpTerminator.terminate();
    });
  };

  
}


export default Server;
