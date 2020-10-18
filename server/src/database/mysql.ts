import mysql from 'mysql';
import { logger } from '../config/winston';
import { Database, User } from '../types';

export default (database: Database) => {
  const connection = mysql.createConnection({
    host: database.host || 'localhost',
    port: database.port || 3306,
    user: database.user || 'root',
    password: database.password
  });

  const connect = () =>
    new Promise((resolve, reject) => {
      connection.connect((error) => {
        if (error) {
          logger.error(`error connecting MySQL: ${error}`);
          reject(error);
          return;
        }

        logger.info(`MySQL connected as id ${connection.threadId}`);
        resolve();
      });
    });
  
  const checkDB = () =>
    new Promise((resolve, reject) => {
      connection.query(
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
  
  const selectDB = () =>
    new Promise((resolve, reject) => {
      connection.changeUser({database: database.name}, (error) => {
        if (error) {
          reject(error);
          return;
        }

        logger.info(`MySQL selected database: ${database.name}`);
        resolve();
      })
    });
  
    const createDB = () =>
      new Promise((resolve, reject) => {
        connection.query(
          `CREATE DATABASE ${database.name}`,
          (error) => {
            if (error) {
              reject(error);
              return;
            }
  
            logger.info(`MySQL created database: ${database.name}`);
            resolve();
          }
        );
      });

  const setDB = async () => {
    try {
      const dbExists = await checkDB();

      if (dbExists) {
        await selectDB();
      } else {
        await createDB();
        await selectDB();
      }
    } catch (err) {
      throw err;
    }
  }

  const getUser = (username: string) =>
    new Promise<User>((resolve, reject) => {
      connection.query(
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

  const setUser = (user: { email: string, password: string}) =>
    new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO users SET ?',
        user,
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });

  return { connect, getUser, setDB, setUser };
};
