import mysql from 'mysql';
import { logger } from '../config/winston';
import { Database } from '../types';

export default (database: Database) => {
  const connection = mysql.createConnection({
    host: database.host || 'localhost',
    port: database.port || 3306,
    database: database.name,
    user: database.user || 'root',
    password: database.password
  });

  const connect = () =>
    new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          logger.error(`error connecting MySQL: ${err.stack}`);
          reject();
        }

        logger.info(`MySQL connected as id ${connection.threadId}`);
        resolve();
      });
    });

  const getUser = (username: string) =>
    new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM `users` WHERE `email` = ?',
        [username],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results.length === 0) {
            reject(new Error());
          }
          resolve(results);
        }
      );
    });

  return { connect, getUser };
};
