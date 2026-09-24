import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "../config/env.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";
import { syncRouter } from "./routes/sync.js";
import { metricsRouter } from "./routes/metrics.js";
import { sendApiError } from "./errors.js";
import { createLogger } from "../logger.js";

const logger = createLogger("server");

export function createApp() {
  const app = new Hono();

  const allowedOrigins = env.CHAT_CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    "*",
    cors({
      origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    })
  );

  app.route("/", healthRouter);
  app.route("/", chatRouter);
  app.route("/", syncRouter);
  app.route("/", metricsRouter);

  app.notFound((c) => sendApiError(c, 404, "NOT_FOUND", "Not found"));

  app.onError((err, c) => {
    logger.error("Unhandled request error", err);
    return sendApiError(c, 500, "INTERNAL_ERROR", "Internal server error");
  });

  return app;
}
