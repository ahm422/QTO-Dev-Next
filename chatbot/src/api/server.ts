import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";
import { syncRouter } from "./routes/sync.js";
import { metricsRouter } from "./routes/metrics.js";

const logger = createLogger("server");

export function createServer() {
  const app = express();

  const allowedOrigins = env.CHAT_CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    })
  );
  app.use(express.json({ limit: "32kb" }));

  app.use(healthRouter);
  app.use(chatRouter);
  app.use(syncRouter);
  app.use(metricsRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled request error", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
