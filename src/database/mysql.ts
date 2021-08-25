import mysql from 'mysql2';
import { logger } from '../config/winston';
import { App, Database, User } from '../types';

export default class MySql {
  static checkDB = (database: Database): Promise<boolean | void> =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(
        `SHOW DATABASES WHERE \`Database\` = '${database.name}'`,
        (error, result: unknown[]) => {
          if (error) {
            reject(error);
            return;
          }

          if (result.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      );
    });

  static connect = (
    database: Database,
  ): mysql.Pool | Promise<mysql.Connection> => {
    if (database.pool) {
      return MySql.createPool(database);
    }
    return MySql.createConnection(database);
  };

  static createConnection = (database: Database): Promise<mysql.Connection> => {
    const connection = mysql.createConnection({
      host: database.host || 'localhost',
      port: database.port || 3306,
      user: database.user || 'root',
      password: database.password,
    });

    return new Promise<mysql.Connection>((resolve, reject) => {
      connection.connect((error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(
          `MySQL connected as id ${connection.threadId?.toString() || 'null'}`,
        );
        resolve(connection);
      });
    });
  };

  static createDB = (database: Database): Promise<void> =>
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

  static createPool = (
    database: Database,
    databaseName?: string,
  ): mysql.Pool => {
    const pool = mysql.createPool({
      database: databaseName,
      host: database.host || 'localhost',
      password: database.password,
      port: database.port || 3306,
      user: database.user || 'root',
    });

    logger.info(
      databaseName
        ? `MySQL created pool assigned to database: ${database.name}`
        : 'MySQL created pool',
    );
    return pool;
  };

  static getUser = (
    database: Database,
    username: string,
  ): Promise<User | undefined> =>
    new Promise<User | undefined>((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query(
        'SELECT * FROM users WHERE email = ?',
        [username],
        (error, result) => {
          const users = result as User[];
          if (error) {
            reject(error);
          }
          if (users.length === 0) {
            resolve(undefined);
          }
          resolve(users[0]);
        },
      );
    });

  static selectDB = (app: App, database: Database): Promise<string> =>
    new Promise<Database['name']>((resolve, reject) => {
      const { mysqlConnection } = database;

      if (database.pool) {
        mysqlConnection?.end((error) => {
          if (error) {
            reject(error);
            return;
          }
          logger.info('MySQL ended pool');

          const updatedDB = { ...database };
          updatedDB.mysqlConnection = MySql.createPool(
            updatedDB,
            database.name,
          );
          app.set('database', updatedDB);

          resolve(database.name);
        });
      } else {
        // Connection
        mysqlConnection?.changeUser({ database: database.name }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          logger.info(`MySQL selected database: ${database.name}`);
          resolve(database.name);
        });
      }
    });

  static setDB = async (app: App, database: Database): Promise<void> => {
    const dbExists = await MySql.checkDB(database);

    if (dbExists) {
      logger.info('MySQL found database');
      await MySql.selectDB(app, database);
    } else {
      await MySql.createDB(database);
      await MySql.selectDB(app, database);
    }
  };

  static setUser = (
    database: Database,
    user: { email: string; password: string },
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      const { mysqlConnection } = database;

      mysqlConnection?.query('INSERT INTO users SET ?', user, (error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
}
