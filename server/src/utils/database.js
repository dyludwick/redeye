import mysql from '../database/mysql';
import logger from '../config/winston';

class DatabaseUtils {
  static initDB = (database) => {
    switch (database.id) {
      case 'mysql':
        mysql(database).connect();
        break;
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };

  static getUser = (database, email) => {
    switch (database.id) {
      case 'mysql':
        return mysql(database).getUser(email);
      default:
        logger.warn(`Database: ${database.id} not recognized`);
    }
  };
}

export default DatabaseUtils;
