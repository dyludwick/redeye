import mysql from '../database/mysql';
import { logger } from '../config/winston';
import { Database } from '../types';

class DatabaseUtils {
  static initDB = (database: Database) => {
    switch (database.id) {
      case 'mysql':
        mysql(database).connect();
        break;
      default:
        logger.warn(`Database: ${database.id} not recognized`);
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
}

export default DatabaseUtils;
