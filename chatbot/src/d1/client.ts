import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import type { D1Client } from "./types.js";
import { LocalD1Client } from "./localClient.js";
import { RemoteD1Client } from "./remoteClient.js";

const logger = createLogger("d1");

function createClient(): D1Client {
  if (env.D1_MODE === "remote") {
    logger.info("D1_MODE=remote — reading via Cloudflare D1 HTTP API");
    return new RemoteD1Client();
  }
  logger.info("D1_MODE=local — reading the main app's local D1 sqlite file directly");
  return new LocalD1Client();
}

export const d1: D1Client = createClient();
