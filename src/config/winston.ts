import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
});

class LoggerStream {
  // eslint-disable-next-line class-methods-use-this
  write(message: string): void {
    logger.info(message);
  }
}

export { logger, LoggerStream };
