import fs from 'fs';
import jwt from 'jsonwebtoken';
import logger from '../config/winston';

let privateKey;
let publicKey;

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
  static signToken = (payload) => {
    const signOptions = {
      expiresIn: '1h',
      algorithm: 'RS256'
    };

    return jwt.sign(payload, privateKey, signOptions);
  };

  static verifyToken = (token) => {
    const verifyOptions = {
      maxAge: '1h',
      algorithm: ['RS256']
    };

    return jwt.verify(token, publicKey, verifyOptions);
  };
}

export default AuthUtils;
