import express from 'express';
import {} from 'dotenv/config';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './config/winston';

// Init express
const app = express();

// gzip compression
app.use(compression());

// secure http headers
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Http logging
app.use(morgan('combined', { stream: logger.stream }));

export default app;
