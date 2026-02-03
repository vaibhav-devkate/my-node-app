import winston, { type Logger } from 'winston';
import config from './config';
import { RequestContext } from '../utils/requestContext';

const enumerateErrorFormat = winston.format((info: winston.Logform.TransformableInfo) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const requestIdFormat = winston.format((info) => {
  const requestId = RequestContext.getRequestId();
  if (requestId) {
    info.requestId = requestId;
  }
  return info;
});

const logger: Logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    requestIdFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    config.env === 'production' 
      ? winston.format.json() 
      : winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const requestIdPart = info.requestId ? ` [${info.requestId}]` : '';
          const message = typeof info.message === 'string' ? info.message : JSON.stringify(info.message);
          return `${info.level}:${requestIdPart} ${message}`;
        }),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;
