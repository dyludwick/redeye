import mysql from 'mysql';
import { logger } from '../config/winston';
import { Database, User } from '../types';

export default class MySql {
  static createConnection = (database: Database) => {
    const connection = mysql.createConnection({
      host: database.host || 'localhost',
      port: database.port || 3306,
      user: database.user || 'root',
      password: database.password
    });

    return new Promise<mysql.Connection>((resolve, reject) => {
      connection.connect((error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(`MySQL connected as id ${connection.threadId}`);
        resolve(connection);
      });
    });
  };

  static createPool = (database: Database) => {
    const pool = mysql.createPool({
      host: database.host || 'localhost',
      password: database.password,
      port: database.port || 3306,
      user: database.user || 'root'
    });

    return pool;
  };

  static connect = (database: Database) => {
    if (database.pool) {
      return MySql.createPool(database);
    } else {
      return MySql.createConnection(database);
    }
  };

  static checkDB = (database: Database) =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(
        `SHOW DATABASES WHERE \`Database\` = '${database.name}'`,
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (result.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });

  static selectDB = (database: Database) =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      if (mysqlConnection && 'changeUser' in mysqlConnection) {
        // Connection
        mysqlConnection?.changeUser({ database: database.name }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`MySQL selected database: ${database.name}`);
          resolve(database.name);
        });
      } else {
        // Pool
        mysqlConnection?.getConnection((error, connection) => {
          if (error) {
            reject(error);
            return;
          }

          connection.changeUser({ database: database.name }, (error) => {
            if (error) {
              reject(error);
              return;
            }

            logger.info(`MySQL selected database: ${database.name}`);
            resolve(database.name);
          });
        });
      }
    });

  static createDB = (database: Database) =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(`CREATE DATABASE ${database.name}`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(`MySQL created database: ${database.name}`);
        resolve(database.name);
      });
    });

  static setDB = async (database: Database) => {
    const dbExists = await MySql.checkDB(database);

    if (dbExists) {
      await MySql.selectDB(database);
    } else {
      await MySql.createDB(database);
      await MySql.selectDB(database);
    }
  };

  static getUser = (database: Database, username: string) =>
    new Promise<User | undefined>((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(
        'SELECT * FROM users WHERE email = ?',
        [username],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results.length === 0) {
            resolve(undefined);
          }
          resolve(results[0]);
        }
      );
    });

  static setUser = (
    database: Database,
    user: { email: string; password: string }
  ) =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(
        'INSERT INTO users SET ?',
        user,
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
}
