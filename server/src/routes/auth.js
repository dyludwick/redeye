import express from 'express';
import fs from 'fs';
import logger from '../config/winston';
import path from 'path';
import { fetchToken, verifyLogin } from '../middleware/auth';

// Read JSON config
let login;

try {
  const jsonPath = path.join(
    __dirname,
    '..',
    '..',
    'json',
    `${process.env.CONFIG_ID}.json`
  );
  const rawData = JSON.parse(fs.readFileSync(jsonPath));
  ({ login } = rawData);
} catch (err) {
  logger.error(
    `JSON configuration not found
    ${err}`
  );
}

// Init router
const router = express.Router();

router.post(login.endpoint, verifyLogin, fetchToken, (req, res) => {
  res.json({ token: req.token });
});

export default router;
