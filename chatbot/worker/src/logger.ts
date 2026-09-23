import { env } from "./config/env.js";

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
type Level = keyof typeof LEVELS;

function log(level: Level, scope: string, message: string, extra?: unknown) {
  if (LEVELS[level] < LEVELS[env.LOG_LEVEL]) return;
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${scope}] ${message}`;
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  if (extra !== undefined) fn(line, extra);
  else fn(line);
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, extra?: unknown) => log("debug", scope, message, extra),
    info: (message: string, extra?: unknown) => log("info", scope, message, extra),
    warn: (message: string, extra?: unknown) => log("warn", scope, message, extra),
    error: (message: string, extra?: unknown) => log("error", scope, message, extra),
  };
}
