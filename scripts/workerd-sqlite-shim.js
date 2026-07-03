/**
 * Stub for wrangler esbuild when bundling OpenNext handler node compat shims.
 * App data uses D1 via Prisma — this module is not invoked at runtime.
 */
class DatabaseSync {
  prepare() {
    return { all: () => [], get: () => null, run: () => ({ changes: 0 }) };
  }
  exec() {}
  close() {}
}

module.exports = { DatabaseSync, default: { DatabaseSync } };
