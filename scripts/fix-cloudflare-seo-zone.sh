#!/usr/bin/env bash
# Fix Cloudflare zone SEO settings for qtodev.com (#399 Phase 5/CF checklist).
#
# Requires a token with:
#   Zone → Zone Settings → Edit
#   Zone → DNS → Edit
#   Zone → Zone → Read
#
# Usage:
#   export CF_API_TOKEN=...   # or CLOUDFLARE_API_TOKEN
#   bash scripts/fix-cloudflare-seo-zone.sh
#
# What it does:
#   1. Enables Always Use HTTPS
#   2. Ensures SSL mode is at least "full"
#   3. Creates www CNAME → apex (DNS only; proxied) if missing
#   4. Prints current settings for verification
set -euo pipefail

TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
ZONE_NAME="${CF_ZONE_NAME:-qtodev.com}"
APEX="${CF_APEX_HOST:-qtodev.com}"

if [[ -z "$TOKEN" ]]; then
  echo "ERROR: Set CF_API_TOKEN (or CLOUDFLARE_API_TOKEN) with Zone Settings Edit + DNS Edit." >&2
  echo "Create one at: https://dash.cloudflare.com/profile/api-tokens" >&2
  exit 1
fi

# Reject common copy-paste placeholders from docs (…, ..., YOUR_TOKEN, etc.)
if [[ "$TOKEN" == "…" || "$TOKEN" == "..." || "$TOKEN" == *"YOUR"* || "$TOKEN" == *"paste"* || ${#TOKEN} -lt 20 ]]; then
  echo "ERROR: CF_API_TOKEN looks like a placeholder or is too short (len=${#TOKEN})." >&2
  echo "Export the real token from Cloudflare → My Profile → API Tokens (not the '…' example)." >&2
  exit 1
fi

api() {
  local method="$1" path="$2"
  shift 2
  curl -sS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    "$@"
}

echo "==> Resolving zone id for ${ZONE_NAME}"
ZONE_JSON=$(api GET "/zones?name=${ZONE_NAME}")
ZONE_ID=$(printf '%s' "$ZONE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r and d.get('success') else '')")
if [[ -z "$ZONE_ID" ]]; then
  echo "ERROR: Could not resolve zone id. Response:" >&2
  echo "$ZONE_JSON" >&2
  exit 1
fi
echo "    zone_id=${ZONE_ID}"

echo "==> Enable Always Use HTTPS"
api PATCH "/zones/${ZONE_ID}/settings/always_use_https" \
  --data '{"value":"on"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('    success=', d.get('success'), 'value=', (d.get('result') or {}).get('value')); raise SystemExit(0 if d.get('success') else 1)"

echo "==> Ensure SSL mode is full (or stricter)"
CURRENT_SSL=$(api GET "/zones/${ZONE_ID}/settings/ssl" | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('result') or {}).get('value') or '')")
echo "    current ssl=${CURRENT_SSL}"
if [[ "$CURRENT_SSL" == "off" || "$CURRENT_SSL" == "flexible" || -z "$CURRENT_SSL" ]]; then
  api PATCH "/zones/${ZONE_ID}/settings/ssl" \
    --data '{"value":"full"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('    updated ssl success=', d.get('success')); raise SystemExit(0 if d.get('success') else 1)"
fi

echo "==> Ensure www DNS CNAME → ${APEX}"
DNS_JSON=$(api GET "/zones/${ZONE_ID}/dns_records?name=www.${ZONE_NAME}")
WWW_ID=$(printf '%s' "$DNS_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')")
if [[ -z "$WWW_ID" ]]; then
  api POST "/zones/${ZONE_ID}/dns_records" \
    --data "{\"type\":\"CNAME\",\"name\":\"www\",\"content\":\"${APEX}\",\"proxied\":true,\"ttl\":1}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('    created www CNAME success=', d.get('success')); raise SystemExit(0 if d.get('success') else 1)"
else
  echo "    www record already exists (id=${WWW_ID})"
fi

echo "==> Verification"
api GET "/zones/${ZONE_ID}/settings/always_use_https" | python3 -c "import sys,json; d=json.load(sys.stdin); print('    always_use_https=', (d.get('result') or {}).get('value'))"
api GET "/zones/${ZONE_ID}/settings/ssl" | python3 -c "import sys,json; d=json.load(sys.stdin); print('    ssl=', (d.get('result') or {}).get('value'))"
echo "Done. Confirm: curl -sI http://${APEX}/ | head -5  (expect 301/302 → https)"
echo "Confirm: dig +short www.${ZONE_NAME}  (expect Cloudflare IPs or CNAME)"
