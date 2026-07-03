export type D1Target = "local" | "staging" | "remote";

export interface MigrationCliOptions {
  dryRun: boolean;
  table?: string;
  skipMedia: boolean;
  d1: D1Target;
  force: boolean;
  sample: number;
  checkUrls: boolean;
  out?: string;
  snapshot?: string;
}

export function parseArg(name: string): string | undefined {
  const eqFlag = `--${name}=`;
  const eqArg = process.argv.find((a) => a.startsWith(eqFlag));
  if (eqArg) return eqArg.slice(eqFlag.length).trim();

  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("--")) {
    return process.argv[idx + 1].trim();
  }
  return undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

export function parseMigrationCli(defaults?: Partial<MigrationCliOptions>): MigrationCliOptions {
  const d1Arg = parseArg("d1") as D1Target | undefined;
  const sampleArg = parseArg("sample");

  return {
    dryRun: hasFlag("dry-run"),
    table: parseArg("table"),
    skipMedia: hasFlag("skip-media"),
    d1: d1Arg ?? defaults?.d1 ?? "local",
    force: hasFlag("force"),
    sample: sampleArg ? Number.parseInt(sampleArg, 10) : (defaults?.sample ?? 10),
    checkUrls: hasFlag("check-urls"),
    out: parseArg("out"),
    snapshot: parseArg("snapshot"),
  };
}

export function assertD1Target(value: string): asserts value is D1Target {
  if (!["local", "staging", "remote"].includes(value)) {
    throw new Error(`Invalid --d1 value "${value}". Use local, staging, or remote.`);
  }
}

export function parseCliD1Target(defaultTarget: D1Target = "local"): D1Target {
  const d1Arg = parseArg("d1");
  if (!d1Arg) return defaultTarget;
  assertD1Target(d1Arg);
  return d1Arg;
}
