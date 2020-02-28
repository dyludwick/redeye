import * as mysql from '../database/mysql';
import logger from '../config/winston';

class DatabaseUtils {
  static initDB = (db) => {
    switch (db) {
      case 'mysql':
        mysql.connect();
        break;
      default:
        logger.warn(`Database: ${db} not recognized`);
    }
  };

  static getUser = (email) => {
    const db = process.env.DB;
    switch (db) {
      case 'mysql':
        return mysql.getUser(email);
      default:
        logger.warn(`Database: ${db} not recognized`);
    }
  };
}

export default DatabaseUtils;
