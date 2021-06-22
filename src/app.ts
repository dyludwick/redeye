import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { LoggerStream } from './config/winston';

// Init express
const app = express();

// gzip compression
app.use(compression());

// secure http headers
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Http logging
app.use(morgan('combined', { stream: new LoggerStream() }));

export default app;
