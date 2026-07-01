const cloudflareContextSymbol = Symbol.for("__cloudflare-context__");

export function getRuntimeD1Database(): D1Database | undefined {
  const ctx = (globalThis as Record<symbol, unknown>)[cloudflareContextSymbol] as
    | { env?: CloudflareEnv }
    | undefined;
  return ctx?.env?.DB;
}
