/** Skip D1 queries during `next build` (low-RAM hosts / webpack). Pages ISR on first request at the edge. */
export function skipBuildTimeD1(): boolean {
  return process.env.SKIP_BUILD_TIME_D1 === "1";
}
