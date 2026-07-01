#!/usr/bin/env bash
# Verify required Wrangler secrets are registered for qtodev-site.
# Usage: npm run secrets:verify
set -euo pipefail

cd "$(dirname "$0")/.."

REQUIRED_SECRETS=(
  JWT_ACCESS_SECRET
  CRON_SECRET
  RESEND_API_KEY
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  REVALIDATE_SECRET
  R2_S3_ENDPOINT
  R2_REGION
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
  R2_BUCKET_NAME
)

OPTIONAL_SECRETS=(
  DATABASE_URL
)

list_json="$(npx wrangler secret list 2>/dev/null)" || {
  echo "ERROR: wrangler secret list failed. Deploy the worker first: npm run deploy" >&2
  exit 1
}

registered="$(echo "$list_json" | node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  const names = Array.isArray(data) ? data.map((s) => s.name) : [];
  console.log(names.join('\n'));
")"

missing=()
for name in "${REQUIRED_SECRETS[@]}"; do
  if ! echo "$registered" | grep -qx "$name"; then
    missing+=("$name")
  fi
done

if ((${#missing[@]} > 0)); then
  echo "Missing required secrets:" >&2
  printf '  - %s\n' "${missing[@]}" >&2
  echo "" >&2
  echo "Set each with: npx wrangler secret put <NAME>" >&2
  exit 1
fi

for name in "${OPTIONAL_SECRETS[@]}"; do
  if ! echo "$registered" | grep -qx "$name"; then
    echo "WARN: optional secret $name not set (fallback until Hyperdrive is verified)"
  fi
done

echo "All required secrets are registered ($((${#REQUIRED_SECRETS[@]})) total)."
