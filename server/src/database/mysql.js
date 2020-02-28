import mysql from 'mysql';
import logger from '../config/winston';

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_ || '3306',
  database: process.env.DB_NAME,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD
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

const getUser = (username) =>
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

export { connection, connect, getUser };
