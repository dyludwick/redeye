import MySql from '../database/mysql';
import { logger } from '../config/winston';
import {
  App,
  ConnectionKeys,
  Database,
  MySqlConnection,
  MySqlPool,
  User,
} from '../types';

export default class DatabaseUtils {
  static initDB = async (app: App, database: Database): Promise<void> => {
    try {
      switch (database.id) {
        case 'mysql': {
          const connection = await MySql.connect(database);
          const connectedDB = DatabaseUtils.setConnection(
            connection,
            'mysqlConnection',
            database,
          );
          app.set('database', connectedDB);
          await MySql.setDB(app, connectedDB);
          return;
        }
        default:
          logger.warn(`Database: ${database.id} not recognized`);
      }
    } catch (err) {
      logger.error(`Failed to initialize DB: ${(err as Error).message}`);
      throw err;
    }
  };

  static getUser = (
    database: Database,
    email: string,
  ): Promise<User | undefined> | undefined => {
    switch (database.id) {
      case 'mysql':
        return MySql.getUser(database, email);
      default:
        return Promise.reject(
          new Error(`Database: ${database.id} not recognized`),
        );
    }
  };

  static setConnection = (
    connection: MySqlConnection | MySqlPool,
    connectionKey: ConnectionKeys,
    database: Database,
  ): Database => {
    const connectedDB = { ...database };
    connectedDB[connectionKey] = connection;

    return connectedDB;
  };

  static setUser = (
    database: Database,
    user: { email: string; password: string },
  ): Promise<void> => {
    switch (database.id) {
      case 'mysql':
        return MySql.setUser(database, user);
      default:
        return Promise.reject(
          new Error(`Database: ${database.id} not recognized`),
        );
    }
  };
}
