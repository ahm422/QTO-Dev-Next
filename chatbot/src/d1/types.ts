/** Shape both D1 access modes (local SQLite file, remote Cloudflare HTTP API) implement identically. */
export interface D1Client {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  ping(): Promise<boolean>;
}

/** Rejects any SQL that isn't a plain SELECT — shared by both D1Client implementations. */
export function assertSelectOnly(sql: string): void {
  const normalized = sql.trim().toUpperCase();
  if (!normalized.startsWith("SELECT")) {
    throw new Error(`Refusing to execute non-SELECT statement against D1: "${sql.slice(0, 80)}..."`);
  }
  const forbidden = ["INSERT ", "UPDATE ", "DELETE ", "DROP ", "ALTER ", "CREATE ", "REPLACE "];
  if (forbidden.some((kw) => normalized.includes(kw))) {
    throw new Error(`Refusing to execute statement containing a mutating keyword: "${sql.slice(0, 80)}..."`);
  }
}
