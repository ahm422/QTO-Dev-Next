/**
 * Upload selected public/images assets to R2 under a stable static/ prefix.
 * Issue #370 — foundation for incremental /images → R2 migration.
 *
 * Usage:
 *   npx tsx scripts/upload-public-images-to-r2.ts --dry-run
 *   npx tsx scripts/upload-public-images-to-r2.ts --prefix=static/images --only=team
 *   npx tsx scripts/upload-public-images-to-r2.ts --via=wrangler --write-map=scripts/output/public-images-r2-map.json
 *   npx tsx scripts/upload-public-images-to-r2.ts --via=s3   # requires Object Read & Write S3 API token
 *
 * Key prefix is static/images/... (deterministic, mirrors old paths).
 * Admin uploads continue to use media/<uuid>/... via buildMediaKey.
 *
 * Prefer-optimized: when classification marks preferInstead, upload the
 * optimized file and map the original publicPath → optimized R2 URL.
 *
 * --via=wrangler uses `wrangler r2 object put` (Cloudflare OAuth / API token).
 * --via=s3 uses @aws-sdk/client-s3 PutObject with R2_* env credentials.
 * Default: wrangler (S3 API tokens are often Object-Read-only).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { parseArg } from "./migration/cli";
import { loadMigrationEnv, requireR2Env } from "./migration/env";

const execFileAsync = promisify(execFile);

const SOFT_MAX_BYTES = 1 * 1024 * 1024;
const DEFAULT_PREFIX = "static/images";
const DEFAULT_MAP_PATH = "scripts/output/public-images-r2-map.json";
const CLASSIFICATION_PATH = "scripts/output/public-images-classification.json";

const SECTIONS = [
  "team",
  "backgrounds",
  "services",
  "pexels",
  "chrome",
  "content",
  "optimized",
  "dead",
  "all",
] as const;

type Section = (typeof SECTIONS)[number];
type Via = "wrangler" | "s3";

type ClassificationFile = {
  publicPath: string;
  category: string;
  section: string;
  upload: boolean;
  preferInstead?: string;
  refs?: string[];
  notes?: string;
};

type ClassificationDoc = {
  generatedAt?: string;
  issue?: number;
  preferOptimized?: Record<string, string>;
  files: ClassificationFile[];
};

type MapEntry = {
  publicPath: string;
  r2Key: string;
  r2Url: string;
  localPath: string;
  sizeBytes: number;
  contentType: string;
  status: "uploaded" | "skipped" | "mapped" | "dry-run";
  preferredFrom?: string;
  warnedLarge?: boolean;
};

type R2Env = ReturnType<typeof requireR2Env>;

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function normalizeEndpoint(raw: string, bucket: string): string {
  const trimmed = raw.replace(/\/$/, "");
  const suffix = `/${bucket}`;
  return trimmed.endsWith(suffix) ? trimmed.slice(0, -suffix.length) : trimmed;
}

function contentTypeForPath(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".avif")) return "image/avif";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

/** /images/foo.jpg → foo.jpg (relative under public/images) */
function relativeUnderImages(publicPath: string): string {
  if (!publicPath.startsWith("/images/")) {
    throw new Error(`Expected publicPath under /images/, got: ${publicPath}`);
  }
  return publicPath.slice("/images/".length);
}

function localFsPath(publicPath: string): string {
  return resolve(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

function r2KeyFor(publicPath: string, prefix: string): string {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  return `${cleanPrefix}/${relativeUnderImages(publicPath)}`;
}

function publicUrlFor(key: string, publicBase: string): string {
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

function parseOnly(): Section {
  const raw = parseArg("only") ?? "all";
  if (!SECTIONS.includes(raw as Section)) {
    throw new Error(
      `Invalid --only="${raw}". Use one of: ${SECTIONS.join(", ")}`
    );
  }
  return raw as Section;
}

function parseVia(): Via {
  const raw = (parseArg("via") ?? "wrangler").toLowerCase();
  if (raw !== "wrangler" && raw !== "s3") {
    throw new Error(`Invalid --via="${raw}". Use wrangler or s3.`);
  }
  return raw;
}

function loadClassification(): ClassificationDoc {
  const path = resolve(process.cwd(), CLASSIFICATION_PATH);
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${CLASSIFICATION_PATH}. Generate inventory/classification first.`
    );
  }
  return JSON.parse(readFileSync(path, "utf8")) as ClassificationDoc;
}

function matchesSection(file: ClassificationFile, only: Section): boolean {
  if (only === "all") return true;
  // content overlaps pexels seed thumbnails
  if (only === "content") return file.section === "content" || file.section === "pexels";
  return file.section === only;
}

function selectFiles(doc: ClassificationDoc, only: Section): ClassificationFile[] {
  const preferMap = doc.preferOptimized ?? {};

  return doc.files.filter((f) => {
    if (!matchesSection(f, only)) return false;

    if (f.upload) return true;

    if (f.preferInstead || preferMap[f.publicPath]) {
      return f.category === "A" || f.category === "B" || Boolean(f.refs?.length);
    }
    return false;
  });
}

function createS3Client(r2Env: R2Env): S3Client {
  return new S3Client({
    endpoint: normalizeEndpoint(r2Env.endpoint, r2Env.bucket),
    region: r2Env.region,
    credentials: {
      accessKeyId: r2Env.accessKeyId,
      secretAccessKey: r2Env.secretAccessKey,
    },
    forcePathStyle: true,
    // R2 rejects some AWS SDK v3 flexible-checksum headers
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  } as ConstructorParameters<typeof S3Client>[0]);
}

/** Prefer public URL HEAD (works without S3 write perms). Fall back to S3 HeadObject. */
async function objectExists(
  r2Url: string,
  client: S3Client | null,
  bucket: string,
  key: string
): Promise<boolean> {
  try {
    const res = await fetch(r2Url, { method: "HEAD" });
    if (res.ok) return true;
    if (res.status === 404) return false;
  } catch {
    // fall through to S3
  }

  if (!client) return false;
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadViaS3(
  client: S3Client,
  bucket: string,
  key: string,
  localPath: string,
  contentType: string
): Promise<void> {
  const body = readFileSync(localPath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

async function uploadViaWrangler(
  bucket: string,
  key: string,
  localPath: string,
  contentType: string
): Promise<void> {
  const objectRef = `${bucket}/${key}`;
  try {
    await execFileAsync(
      "npx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        objectRef,
        `--file=${localPath}`,
        `--content-type=${contentType}`,
        "--remote",
      ],
      {
        cwd: process.cwd(),
        maxBuffer: 16 * 1024 * 1024,
        env: process.env,
      }
    );
  } catch (err: unknown) {
    const e = err as { stderr?: string | Buffer; stdout?: string | Buffer; message?: string };
    const detail = [e.stderr?.toString(), e.stdout?.toString(), e.message]
      .filter(Boolean)
      .join("\n");
    throw new Error(`wrangler put failed for ${objectRef}:\n${detail}`);
  }
}

async function uploadFile(opts: {
  via: Via;
  client: S3Client | null;
  bucket: string;
  key: string;
  r2Url: string;
  localPath: string;
  contentType: string;
  dryRun: boolean;
}): Promise<"uploaded" | "skipped" | "dry-run"> {
  if (await objectExists(opts.r2Url, opts.client, opts.bucket, opts.key)) {
    return "skipped";
  }
  if (opts.dryRun) return "dry-run";

  if (opts.via === "wrangler") {
    await uploadViaWrangler(opts.bucket, opts.key, opts.localPath, opts.contentType);
  } else {
    if (!opts.client) throw new Error("S3 client required for --via=s3");
    await uploadViaS3(opts.client, opts.bucket, opts.key, opts.localPath, opts.contentType);
  }
  return "uploaded";
}

async function main() {
  loadMigrationEnv();
  const dryRun = hasFlag("dry-run");
  const prefix = parseArg("prefix") ?? DEFAULT_PREFIX;
  const writeMap = parseArg("write-map") ?? DEFAULT_MAP_PATH;
  const only = parseOnly();
  const via = parseVia();

  const r2Env = requireR2Env();
  const classification = loadClassification();
  const selected = selectFiles(classification, only);
  const preferMap = classification.preferOptimized ?? {};

  const client = via === "s3" ? createS3Client(r2Env) : null;

  console.log(
    `\nUpload public/images → R2 (via=${via}, prefix=${prefix}, only=${only}, dryRun=${dryRun})`
  );
  console.log(`Selected classification rows: ${selected.length}\n`);

  const map: Record<string, string> = {};
  const details: MapEntry[] = [];
  const uploadedKeys = new Set<string>();

  let uploaded = 0;
  let skipped = 0;
  let mappedOnly = 0;
  let failed = 0;
  let largeWarnings = 0;

  for (const entry of selected) {
    const preferred =
      entry.preferInstead ?? preferMap[entry.publicPath] ?? undefined;
    const uploadPublicPath = preferred ?? entry.publicPath;
    const localPath = localFsPath(uploadPublicPath);

    if (!existsSync(localPath)) {
      console.error(`  MISSING local file: ${localPath} (for ${entry.publicPath})`);
      failed++;
      continue;
    }

    const key = r2KeyFor(uploadPublicPath, prefix);
    const contentType = contentTypeForPath(localPath);
    const sizeBytes = statSync(localPath).size;
    const r2Url = publicUrlFor(key, r2Env.publicUrl);

    const warnedLarge = !preferred && sizeBytes > SOFT_MAX_BYTES;
    if (warnedLarge) {
      largeWarnings++;
      console.warn(
        `  WARN soft-max: ${uploadPublicPath} is ${(sizeBytes / 1048576).toFixed(1)}MB (>1MB) — consider re-encoding before follow-up PRs`
      );
    }

    let status: MapEntry["status"];
    try {
      if (uploadedKeys.has(key)) {
        status = "mapped";
        mappedOnly++;
      } else if (entry.upload || preferred) {
        const result = await uploadFile({
          via,
          client,
          bucket: r2Env.bucket,
          key,
          r2Url,
          localPath,
          contentType,
          dryRun,
        });
        uploadedKeys.add(key);
        if (result === "uploaded") {
          status = "uploaded";
          uploaded++;
          console.log(`  UPLOADED ${key}`);
        } else if (result === "skipped") {
          status = "skipped";
          skipped++;
          console.log(`  SKIP exists ${key}`);
        } else {
          status = "dry-run";
          uploaded++;
          console.log(`  DRY-RUN would upload ${key}`);
        }
      } else {
        status = "mapped";
        mappedOnly++;
      }
    } catch (err) {
      console.error(`  FAIL ${key}:`, err);
      failed++;
      continue;
    }

    map[entry.publicPath] = r2Url;
    if (preferred && preferred !== entry.publicPath) {
      map[preferred] = r2Url;
    }

    details.push({
      publicPath: entry.publicPath,
      r2Key: key,
      r2Url,
      localPath: uploadPublicPath,
      sizeBytes,
      contentType,
      status,
      preferredFrom: preferred ? entry.publicPath : undefined,
      warnedLarge,
    });
  }

  const artifact = {
    generatedAt: new Date().toISOString(),
    issue: 370,
    prefix,
    only,
    via,
    dryRun,
    r2PublicUrl: r2Env.publicUrl,
    r2Bucket: r2Env.bucket,
    summary: {
      selected: selected.length,
      uploaded,
      skipped,
      mappedOnly,
      failed,
      largeWarnings,
      mapEntries: Object.keys(map).length,
    },
    map,
    details,
  };

  const outPath = resolve(process.cwd(), writeMap);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n");
  console.log(`\nWrote map → ${writeMap}`);
  console.table(artifact.summary);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
