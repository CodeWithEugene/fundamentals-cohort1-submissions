import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { errorHandler } from "./Middlewares/error";

import v1Payments from './routes/v1/payments';
import v2Payments from './routes/v2/payments';
import logger from "./util/logger";
import { requestTimingMiddleware, register, appUptimeGauge } from './util/metrics';


export const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://deployhub-nine.vercel.app",
  "https://5173-firebase-pluse-track-1761081803784.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev"
];

app.use(requestTimingMiddleware)

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);


    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is allowed for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/v1/payments', v1Payments);
app.use('/api/v2/payments', v2Payments);

app.use("/health-check", (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
})
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

appUptimeGauge.set({ service: 'backend' }, process.uptime());


app.use((req, res) => {
  logger.info('not found', { path: req.path });
  res.status(404).send({ error: 'Not found' });
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;



if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
}
