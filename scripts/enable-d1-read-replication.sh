#!/usr/bin/env bash
# Enable D1 read replication (mode: auto) on production and staging databases.
# Requires CF_API_TOKEN with D1 write permission.
#
# Usage:
#   CF_API_TOKEN=... ./scripts/enable-d1-read-replication.sh
#   CF_API_TOKEN=... ./scripts/enable-d1-read-replication.sh --verify-only
set -euo pipefail

ACCOUNT_ID="YOUR_CLOUDFLARE_ACCOUNT_ID"
PROD_DB_ID="YOUR_D1_DATABASE_ID"
STAGING_DB_ID="YOUR_STAGING_D1_DATABASE_ID"

VERIFY_ONLY=false
if [[ "${1:-}" == "--verify-only" ]]; then
  VERIFY_ONLY=true
fi

if [[ -z "${CF_API_TOKEN:-}" ]]; then
  echo "ERROR: Set CF_API_TOKEN (Cloudflare API token with D1 write)." >&2
  echo "Dashboard alternative: D1 → database → Settings → Read Replication → auto" >&2
  exit 1
fi

enable_db() {
  local db_id="$1"
  local name="$2"

  if [[ "$VERIFY_ONLY" == "true" ]]; then
    curl -sf \
      "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${db_id}" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      | jq -r ".result | \"\(.name): read_replication.mode=\(.read_replication.mode // \"unknown\")\""
    return
  fi

  echo "Enabling read replication (auto) on ${name} (${db_id})…"
  curl -sf -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${db_id}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"read_replication": {"mode": "auto"}}' \
    | jq -r '.success, (.errors // empty)'
}

enable_db "$PROD_DB_ID" "qtodev-d1"
enable_db "$STAGING_DB_ID" "qtodev-d1-staging"

echo ""
echo "Verify with:"
echo "  npx wrangler d1 info qtodev-d1 --json | jq .read_replication"
echo "  npx wrangler d1 info qtodev-d1-staging --env staging --json | jq .read_replication"
