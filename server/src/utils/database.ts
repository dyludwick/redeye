import MySql from '../database/mysql';
import { logger } from '../config/winston';
import {
  App,
  ConnectionKeys,
  Database,
  MySqlConnection
} from '../types';

export default class DatabaseUtils {
  static initDB = async (app: App, database: Database) => {
    try {
      switch (database.id) {
        case 'mysql':
          const connection = await MySql.connect(database);
          const connectedDB = DatabaseUtils.setConnection(
            connection,
            'mysqlConnection',
            database
          );
          app.set('database', connectedDB);
          await MySql.setDB(connectedDB);
          return;
        default:
          logger.warn(`Database: ${database.id} not recognized`);
      }
    } catch (err) {
      logger.error(`Failed to initialize DB: ${err}`);
      throw err;
    }
  };

  static getUser = (database: Database, email: string) => {
    switch (database.id) {
      case 'mysql':
        return MySql.getUser(database, email);
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };

  static setConnection = (
    connection: MySqlConnection,
    connectionKey: ConnectionKeys, 
    database: Database
  ) => {
    const connectedDB = { ...database };
    connectedDB[connectionKey] = connection;

    return connectedDB;
  }

  static setUser = (database: Database, user: { email: string, password: string }) => {
    switch (database.id) {
      case 'mysql':
        return MySql.setUser(database, user);
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };
}
