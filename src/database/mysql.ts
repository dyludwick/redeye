import mysql from 'mysql';
import { logger } from '../config/winston';
import { App, Database, User } from '../types';

export default class MySql {
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

  static connect = (database: Database) => {
    if (database.pool) {
      return MySql.createPool(database);
    } else {
      return MySql.createConnection(database);
    }
  };

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

  static createDB = (database: Database) =>
    new Promise<void>((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(`CREATE DATABASE ${database.name}`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(`MySQL created database: ${database.name}`);
        resolve();
      });
    });

  static createPool = (database: Database, databaseName?: string) => {
    const pool = mysql.createPool({
      database: databaseName,
      host: database.host || 'localhost',
      password: database.password,
      port: database.port || 3306,
      user: database.user || 'root'
    });

    logger.info(
      databaseName
        ? `MySQL created pool assigned to database: ${database.name}`
        : `MySQL created pool`
    );
    return pool;
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

  static selectDB = (app: App, database: Database) =>
    new Promise<Database['name']>((resolve, reject) => {
      const { mysqlConnection } = database;

      if (mysqlConnection && 'changeUser' in mysqlConnection) {
        // Connection
        mysqlConnection.changeUser({ database: database.name }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`MySQL selected database: ${database.name}`);
          resolve(database.name);
        });
      } else {
        // Pool
        mysqlConnection?.end((error) => {
          if (error) {
            reject(error);
            return;
          }
          logger.info(`MySQL ended pool`);

          const updatedDB = { ...database };
          updatedDB['mysqlConnection'] = MySql.createPool(
            updatedDB,
            database.name
          );
          app.set('database', updatedDB);

          resolve(database.name);
        });
      }
    });

  static setDB = async (app: App, database: Database) => {
    const dbExists = await MySql.checkDB(database);

    if (dbExists) {
      logger.info(`MySQL found database`);
      await MySql.selectDB(app, database);
    } else {
      await MySql.createDB(database);
      await MySql.selectDB(app, database);
    }
  };

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
