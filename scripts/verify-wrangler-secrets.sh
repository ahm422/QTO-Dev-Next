#!/usr/bin/env bash
# Verify required Wrangler secrets are registered for qtodev-site (production) or qtodev-site-staging.
# Usage: npm run secrets:verify
#        npm run secrets:verify:staging
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_ARG="${1:-}"
WRANGLER_ENV_FLAG=()
WORKER_LABEL="qtodev-site (production)"

if [[ "$ENV_ARG" == "staging" ]]; then
  WRANGLER_ENV_FLAG=(--env staging)
  WORKER_LABEL="qtodev-site-staging"
elif [[ -n "$ENV_ARG" ]]; then
  echo "ERROR: Unknown environment \"$ENV_ARG\". Use: staging (or omit for production)." >&2
  exit 1
fi

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

echo "Checking secrets for $WORKER_LABEL…"

list_json="$(npx wrangler secret list "${WRANGLER_ENV_FLAG[@]}" 2>/dev/null)" || {
  echo "ERROR: wrangler secret list failed. Deploy the worker first: npm run deploy${ENV_ARG:+:}${ENV_ARG}" >&2
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
  echo "Missing required secrets on $WORKER_LABEL:" >&2
  printf '  - %s\n' "${missing[@]}" >&2
  echo "" >&2
  if [[ "$ENV_ARG" == "staging" ]]; then
    echo "Set each with: npx wrangler secret put <NAME> --env staging" >&2
  else
    echo "Set each with: npx wrangler secret put <NAME>" >&2
  fi
  exit 1
fi

echo "All required secrets are registered on $WORKER_LABEL ($((${#REQUIRED_SECRETS[@]})) total)."
