import mysql from '../database/mysql';
import { logger } from '../config/winston';
import { Database } from '../types';

class DatabaseUtils {
  static initDB = async (database: Database) => {
    try {
      switch (database.id) {
        case 'mysql':
          await mysql(database).connect();
          await mysql(database).setDB();
          break;
        default:
          logger.warn(`Database: ${database.id} not recognized`);
      }
    } catch (err) {
      logger.error(`Failed to initialize DB: ${err}`);
    }
  };

  static getUser = (database: Database, email: string) => {
    switch (database.id) {
      case 'mysql':
        return mysql(database).getUser(email);
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };

  static setUser = (database: Database, user: { email: string, password: string }) => {
    switch (database.id) {
      case 'mysql':
        return mysql(database).setUser(user);
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };
}

export default DatabaseUtils;
