/**
 * Seed-only helpers for rich case-study detail (e.g. lahebo).
 * Public pages read from @/lib/cms/projects.
 */
import { laheboProject } from "./example";
import type { Project } from "./types";

/** Rich detail projects used by prisma/seed/projects.ts */
export function getSeedDetailProjects(): Project[] {
  return [laheboProject];
}
