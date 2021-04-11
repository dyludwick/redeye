import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { logger } from '../config/winston';
import { User } from '../types';

let privateKey: jwt.Secret;
let publicKey: jwt.Secret;

try {
  privateKey = fs.readFileSync('private.key', 'utf8');
  publicKey = fs.readFileSync('public.key', 'utf8');
} catch (err) {
  logger.error(
    `Key file does not exist - did you forget to run genKeys script?
    ${err}`
  );
}

class AuthUtils {
  static comparePassword = (plainTextPassword: string, hash: string) => {
    return bcrypt.compare(plainTextPassword, hash);
  }

  static hashPassword = async (user: { email: string, password: string }) => {
    const saltRounds = 10;

    try {
      const hash = await bcrypt.hash(user.password, saltRounds);
      const hashedUser = { ...user };
      hashedUser.password = hash;
      return hashedUser;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  static signToken = (payload: any) => {
    const signOptions: jwt.SignOptions = {
      expiresIn: '1h',
      algorithm: 'RS256'
    };

    return jwt.sign(payload, privateKey, signOptions);
  };

  static verifyToken = (token: any) => {
    const verifyOptions = {
      maxAge: '1h',
      algorithm: ['RS256']
    };

    return jwt.verify(token, publicKey, verifyOptions);
  };
}

export default AuthUtils;
