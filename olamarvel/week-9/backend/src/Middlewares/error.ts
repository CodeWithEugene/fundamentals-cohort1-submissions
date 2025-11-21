import { ErrorRequestHandler } from "express";
import logger from "../util/logger";
import { httpErrorsTotal } from "../util/metrics";

export const errorHandler: ErrorRequestHandler = (err, req, res,) => {
  const routePath = req.route?.path || req.baseUrl + req.path || req.path;

  if (res.statusCode !== 500) {
    httpErrorsTotal.inc({
      method: req.method,
      route: routePath,
      status_code: res.statusCode,
    });
  }

  logger.error(err);
  const statusCode = err.statusCode || res.statusCode || 500;
  res.status(statusCode).json({
    message: (err).message || "Internal Server error",
    error: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" ? null : err.stack,
  });
};
