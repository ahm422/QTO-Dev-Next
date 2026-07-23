/**
 * Homepage hero copy and CTAs (issue #175, #201, #350).
 * Edit here first, then mirror into prisma/seed/pageSections.ts → homepage.hero
 * and update admin JSON (re-seed or paste). Do not replace with PageHero.
 */

export const heroConfig = {
  badge: "Next-Gen Software Engineering",

  /** White portion of the H1 */
  heading: "Architecting",
  /** Orange highlight portion */
  headingHighlight: "Digital Futures",

  subtext:
    "We build robust, scalable software systems that power modern businesses—from cloud-native platforms to intelligent automation that drives measurable growth.",

  ctaPrimary: "Start Your Project",
  ctaPrimaryHref: "/contact",

  trustedByLabel: "TRUSTED BY",

  terminalLines: [
    "> Initializing core systems...",
    "> Loading modules: React, Node.js, AWS...",
    "> Compiling assets [OK]",
    "> Server running on port 3000",
  ],
} as const;

/** Mutable hero shape for CMS merge / component props (not readonly `as const`). */
export type HeroConfig = {
  badge: string;
  heading: string;
  headingHighlight: string;
  subtext: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  trustedByLabel: string;
  terminalLines: string[];
};

const STRING_KEYS = [
  "badge",
  "heading",
  "headingHighlight",
  "subtext",
  "ctaPrimary",
  "ctaPrimaryHref",
  "trustedByLabel",
] as const satisfies ReadonlyArray<keyof Omit<HeroConfig, "terminalLines">>;

function cloneDefaults(): HeroConfig {
  return {
    ...heroConfig,
    terminalLines: [...heroConfig.terminalLines],
  };
}

/** Use CMS string only when non-empty after trim; otherwise keep default. */
function pickString(cmsValue: unknown, fallback: string): string {
  if (typeof cmsValue !== "string") return fallback;
  const trimmed = cmsValue.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function pickTerminalLines(cmsValue: unknown, fallback: string[]): string[] {
  if (!Array.isArray(cmsValue) || cmsValue.length === 0) {
    return [...fallback];
  }
  const lines = cmsValue.filter(
    (line): line is string => typeof line === "string" && line.trim().length > 0
  );
  return lines.length > 0 ? lines : [...fallback];
}

/**
 * Merge CMS `homepage.hero` JSON with code defaults (per-field).
 * Empty / whitespace-only CMS strings do not wipe required CTAs or copy.
 * Legacy CMS keys `ctaSecondary` / `ctaSecondaryHref` are ignored (single CTA).
 */
export function resolveHeroConfig(cms: unknown): HeroConfig {
  const defaults = cloneDefaults();
  if (cms == null || typeof cms !== "object" || Array.isArray(cms)) {
    return defaults;
  }

  const partial = cms as Record<string, unknown>;
  const resolved = cloneDefaults();

  for (const key of STRING_KEYS) {
    resolved[key] = pickString(partial[key], defaults[key]);
  }

  resolved.terminalLines = pickTerminalLines(
    partial.terminalLines,
    defaults.terminalLines
  );

  return resolved;
}
