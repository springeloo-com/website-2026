#!/usr/bin/env bash
# Quick health check for Sveltia CMS admin + OAuth proxy (run locally).
set -euo pipefail

SITE="${SITE_URL:-https://springeloo-com.github.io/website-2026}"
PROXY="${PROXY_URL:-https://springeloo-decap-oauth.mf-7e0.workers.dev}"
UA="Mozilla/5.0 (compatible; SpringelooCmsCheck/1.0)"

echo "== Admin HTML =="
ADMIN_HTML="$(curl -fsSL -A "$UA" "${SITE}/admin/")"
echo "$ADMIN_HTML" | head -20
if echo "$ADMIN_HTML" | grep -q 'sveltia-cms'; then
  echo "OK: admin HTML references Sveltia CMS script"
else
  echo "FAIL: admin HTML has no sveltia-cms script tag"
  exit 1
fi

echo
echo "== config.yml =="
curl -fsSL -A "$UA" "${SITE}/admin/config.yml" | head -20
curl -fsSL -A "$UA" -o /dev/null -w "config HTTP %{http_code}\n" "${SITE}/admin/config.yml"

echo
echo "== Local Sveltia CMS bundle (if present on site) =="
curl -fsSL -A "$UA" -o /dev/null -w "sveltia-cms.js HTTP %{http_code} size %{size_download}\n" \
  "${SITE}/admin/sveltia-cms.js" || echo "WARN: /admin/sveltia-cms.js not deployed yet"

echo
echo "== OAuth proxy =="
curl -fsSL -A "$UA" "${PROXY}/"
echo
curl -fsSL -A "$UA" -o /dev/null -w "auth redirect HTTP %{http_code}\n" \
  -D - "${PROXY}/auth" 2>/dev/null | head -20 || true

echo
echo "Done. Open ${SITE}/admin/ in a browser."
echo "Expected: Sveltia CMS login UI (GitHub sign-in)."
echo "Note: View Source may show a mostly empty <body>; check Elements after the script runs."
