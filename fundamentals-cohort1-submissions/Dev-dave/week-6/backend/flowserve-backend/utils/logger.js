import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),             // show logs in terminal
    new winston.transports.File({ filename: "app.log" }), // save to app.log
  ],
});

export default logger;
