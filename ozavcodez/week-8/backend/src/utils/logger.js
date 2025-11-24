import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export function createLogger() {
  return pino(
    {
      level: process.env.LOG_LEVEL || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    isDevelopment ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:standard',
      },
    }) : undefined
  );
}

export const logger = createLogger();
