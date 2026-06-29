#!/usr/bin/env bash
# Create qtodev-hyperdrive and bind HYPERDRIVE in wrangler.toml.
#
# Prerequisites:
#   - wrangler logged in (npx wrangler login)
#   - account_id set in wrangler.toml
#   - PostgreSQL origin publicly reachable from the internet (Cloudflare Hyperdrive requirement)
#
# Usage (self-hosted PostgreSQL):
#   export DB_PASSWORD='your-db-password'
#   ./scripts/create-hyperdrive.sh \
#     --host db.example.com \
#     --port 5432 \
#     --user postgres \
#     --database qtodev
#
# Or pass a full connection string:
#   export HYPERDRIVE_ORIGIN_URL='postgresql://postgres:password@db.example.com:5432/qtodev'
#   ./scripts/create-hyperdrive.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

SSLMODE="${HYPERDRIVE_SSLMODE:-prefer}"

if [[ -n "${HYPERDRIVE_ORIGIN_URL:-}" ]]; then
  ARGS=(--connection-string "$HYPERDRIVE_ORIGIN_URL")
  if [[ "$SSLMODE" != "disable" && "$SSLMODE" != "prefer" ]]; then
    ARGS+=(--sslmode "$SSLMODE")
  fi
  npx wrangler hyperdrive create qtodev-hyperdrive \
    "${ARGS[@]}" \
    --update-config \
    --binding HYPERDRIVE
  exit 0
fi

HOST=""
PORT="5432"
USER="postgres"
DATABASE="qtodev"
PASSWORD="${DB_PASSWORD:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2 ;;
    --port) PORT="$2"; shift 2 ;;
    --user) USER="$2"; shift 2 ;;
    --database) DATABASE="$2"; shift 2 ;;
    --password) PASSWORD="$2"; shift 2 ;;
    --sslmode) SSLMODE="$2"; shift 2 ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$HOST" || -z "$PASSWORD" ]]; then
  echo "Set HYPERDRIVE_ORIGIN_URL or pass --host and DB_PASSWORD / --password." >&2
  exit 1
fi

ARGS=(
  --origin-host "$HOST"
  --origin-port "$PORT"
  --database "$DATABASE"
  --origin-user "$USER"
  --origin-password "$PASSWORD"
)

if [[ "$SSLMODE" != "disable" && "$SSLMODE" != "prefer" ]]; then
  ARGS+=(--sslmode "$SSLMODE")
fi

npx wrangler hyperdrive create qtodev-hyperdrive \
  "${ARGS[@]}" \
  --update-config \
  --binding HYPERDRIVE

echo "Done. Run: npm run cf-typegen"
