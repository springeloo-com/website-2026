#!/usr/bin/env bash
# End-to-end check: Cloudflare OAuth proxy → GitHub authorize → user token → write.
#
# The Worker only proxies OAuth. Write rights come from the *user token* minted
# for the logged-in GitHub user (scopes + repo role + org OAuth approval).
#
# Usage (typical):
#   # 1) Always: proxy + authorize URL checks (no secrets needed)
#   bash scripts/check-oauth-chain.sh
#
#   # 2) After Decap login: paste token from DevTools Network Authorization header
#   export GH_TOKEN='gho_...'
#   bash scripts/check-oauth-chain.sh
#
#   # 3) Maintainer optional: also verify Client ID/Secret can inspect the token
#   export GITHUB_OAUTH_ID='Iv23...'
#   export GITHUB_OAUTH_SECRET='...'
#   export GH_TOKEN='gho_...'
#   bash scripts/check-oauth-chain.sh
#
set -euo pipefail

PROXY_URL="${PROXY_URL:-https://springeloo-decap-oauth.mf-7e0.workers.dev}"
SITE_URL="${SITE_URL:-https://springeloo-com.github.io/website-2026}"
REPO="${REPO:-springeloo-com/website-2026}"
API="${API:-https://api.github.com}"
UA="Springeloo-OAuth-Chain-Check/1.0"

PASS=0
FAIL=0
WARN=0

pass() { echo "  PASS: $*"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL: $*"; FAIL=$((FAIL + 1)); }
warn() { echo "  WARN: $*"; WARN=$((WARN + 1)); }
section() { echo; echo "=== $* ==="; }

PROXY_URL="${PROXY_URL%/}"
SITE_URL="${SITE_URL%/}"

section "0) Config under test"
echo "  PROXY_URL=${PROXY_URL}"
echo "  SITE_URL=${SITE_URL}"
echo "  REPO=${REPO}"
echo "  GH_TOKEN set? $([ -n "${GH_TOKEN:-}" ] && echo yes || echo no)"
echo "  GITHUB_OAUTH_ID set? $([ -n "${GITHUB_OAUTH_ID:-}" ] && echo yes || echo no)"
echo "  GITHUB_OAUTH_SECRET set? $([ -n "${GITHUB_OAUTH_SECRET:-}" ] && echo yes || echo no)"

# ---------------------------------------------------------------------------
section "1) Proxy health"
HEALTH=$(curl -fsSL -A "$UA" "${PROXY_URL}/" || true)
if echo "$HEALTH" | grep -qi 'Hello'; then
  pass "GET ${PROXY_URL}/ → ${HEALTH}"
else
  fail "GET ${PROXY_URL}/ did not return Hello (got: ${HEALTH:-empty})"
fi

# ---------------------------------------------------------------------------
section "2) /auth redirect (must request repo scope)"
AUTH_HEADERS=$(curl -sS -A "$UA" -D - -o /dev/null \
  "${PROXY_URL}/auth?provider=github" || true)
LOCATION=$(echo "$AUTH_HEADERS" | awk 'tolower($1)=="location:" {print $2}' | tr -d '\r' | tail -1)
HTTP_AUTH=$(echo "$AUTH_HEADERS" | awk '/^HTTP/{code=$2} END{print code}')

echo "  HTTP=${HTTP_AUTH:-?} Location=${LOCATION:-<none>}"

if [[ -z "${LOCATION}" ]]; then
  fail "/auth did not redirect (is Worker deployed? secrets missing?)"
else
  if [[ "${LOCATION}" == https://github.com/login/oauth/authorize* ]]; then
    pass "redirects to GitHub authorize"
  else
    fail "Location is not GitHub authorize: ${LOCATION}"
  fi

  # Parse query params
  Q="${LOCATION#*\?}"
  python3 - "$Q" <<'PY' || true
import sys, urllib.parse
q = urllib.parse.parse_qs(sys.argv[1])
scope = (q.get("scope") or [""])[0]
cid = (q.get("client_id") or [""])[0]
redir = (q.get("redirect_uri") or [""])[0]
print(f"  client_id={cid}")
print(f"  scope={scope}")
print(f"  redirect_uri={redir}")
open("/tmp/oauth-chain-meta.env", "w").write(
    f"CLIENT_ID_FROM_AUTH={cid}\nSCOPE_FROM_AUTH={scope}\nREDIRECT_FROM_AUTH={redir}\n"
)
PY
  # shellcheck disable=SC1091
  source /tmp/oauth-chain-meta.env 2>/dev/null || true

  if echo "${SCOPE_FROM_AUTH:-}" | grep -q 'repo'; then
    pass "authorize scope includes repo (${SCOPE_FROM_AUTH})"
  else
    fail "authorize scope missing repo (got '${SCOPE_FROM_AUTH:-empty}'). Redeploy Worker from docs/howto-claudflare.md"
  fi

  if [[ "${REDIRECT_FROM_AUTH:-}" == "${PROXY_URL}/callback"* ]]; then
    pass "redirect_uri points at this proxy callback"
  else
    fail "redirect_uri should be ${PROXY_URL}/callback?... (got ${REDIRECT_FROM_AUTH:-empty})"
  fi

  if [[ -n "${GITHUB_OAUTH_ID:-}" ]]; then
    if [[ "${CLIENT_ID_FROM_AUTH:-}" == "${GITHUB_OAUTH_ID}" ]]; then
      pass "authorize client_id matches GITHUB_OAUTH_ID"
    else
      fail "authorize client_id (${CLIENT_ID_FROM_AUTH}) != GITHUB_OAUTH_ID (${GITHUB_OAUTH_ID})"
    fi
  else
    warn "set GITHUB_OAUTH_ID to verify Worker secret matches authorize client_id"
  fi
fi

# ---------------------------------------------------------------------------
section "3) Site Decap config points at this proxy"
CFG=$(curl -fsSL -A "$UA" "${SITE_URL}/admin/config.yml" || true)
if [[ -z "$CFG" ]]; then
  fail "could not fetch ${SITE_URL}/admin/config.yml"
else
  echo "$CFG" | awk '/^backend:/,/^[^ ]/ {print}' | head -20
  BASE=$(echo "$CFG" | awk '/^[[:space:]]*base_url:/ {print $2; exit}' | tr -d '"')
  AEP=$(echo "$CFG" | awk '/^[[:space:]]*auth_endpoint:/ {print $2; exit}' | tr -d '"')
  echo "  parsed base_url=${BASE} auth_endpoint=${AEP}"
  if [[ "${BASE}" == "${PROXY_URL}" ]]; then
    pass "config.yml base_url matches PROXY_URL"
  else
    fail "config.yml base_url (${BASE}) != PROXY_URL (${PROXY_URL})"
  fi
  if [[ "${AEP}" == "auth" || "${AEP}" == "/auth" ]]; then
    pass "auth_endpoint=${AEP}"
  else
    warn "unexpected auth_endpoint=${AEP}"
  fi
fi

# ---------------------------------------------------------------------------
section "4) Admin shell + Decap bundle"
ADMIN_HTML=$(curl -fsSL -A "$UA" "${SITE_URL}/admin/" || true)
if echo "$ADMIN_HTML" | grep -q 'decap-cms.js'; then
  pass "admin HTML references decap-cms.js"
else
  fail "admin HTML missing decap-cms.js"
fi
BUNDLE_CODE=$(curl -sS -A "$UA" -o /dev/null -w "%{http_code}" "${SITE_URL}/admin/decap-cms.js" || true)
BUNDLE_SIZE=$(curl -sS -A "$UA" -o /dev/null -w "%{size_download}" "${SITE_URL}/admin/decap-cms.js" || true)
if [[ "${BUNDLE_CODE}" == "200" && "${BUNDLE_SIZE}" -gt 1000000 ]]; then
  pass "decap-cms.js HTTP 200 size=${BUNDLE_SIZE}"
else
  fail "decap-cms.js HTTP ${BUNDLE_CODE} size=${BUNDLE_SIZE}"
fi

# ---------------------------------------------------------------------------
if [[ -z "${GH_TOKEN:-}" ]]; then
  section "5–7) Skipped (no GH_TOKEN)"
  warn "Log into Decap, copy Authorization token from a api.github.com request,"
  warn "then:  export GH_TOKEN='gho_...' && bash scripts/check-oauth-chain.sh"
  echo
  echo "SUMMARY: proxy/config checks done. FAIL=${FAIL} WARN=${WARN} PASS=${PASS}"
  echo "Chain is incomplete without a user token — Worker cannot invent write rights."
  exit $([[ "$FAIL" -eq 0 ]] && echo 0 || echo 1)
fi

# ---------------------------------------------------------------------------
section "5) Token type + classic OAuth scopes"
PREFIX="${GH_TOKEN:0:4}"
case "$PREFIX" in
  gho_) pass "token prefix gho_ (classic OAuth user token — correct for Decap)" ;;
  ghu_) fail "token prefix ghu_ = GitHub App user-to-server — use an OAuth App, not a GitHub App" ;;
  ghs_) fail "token prefix ghs_ = GitHub App installation token — wrong for Decap" ;;
  ghp_) fail "token prefix ghp_ = classic PAT — not the Decap OAuth session token" ;;
  *) fail "unexpected token prefix '${PREFIX}…' (want gho_)" ;;
esac

auth=(-H "Authorization: token ${GH_TOKEN}" -H "Accept: application/vnd.github+json" -A "$UA")
HEADERS=$(curl -sS -I "${auth[@]}" "${API}/user" || true)
echo "$HEADERS" | grep -iE '^(HTTP|x-oauth-scopes|x-accepted-oauth-scopes):' || true
SCOPES=$(echo "$HEADERS" | awk -F': ' 'tolower($1)=="x-oauth-scopes" {print $2}' | tr -d '\r')
echo "  parsed x-oauth-scopes=[${SCOPES}]"
if echo "${SCOPES}" | grep -q 'repo'; then
  pass "x-oauth-scopes includes repo"
elif [[ -z "${SCOPES// /}" ]]; then
  fail "x-oauth-scopes EMPTY — not a classic OAuth repo token (App token / missing scope / wrong credentials)"
else
  fail "x-oauth-scopes missing repo (got [${SCOPES}]) — revoke app, fix Worker scope, re-login"
fi

LOGIN=$(curl -sS "${auth[@]}" "${API}/user" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("login","?"))')
echo "  login=${LOGIN}"

# ---------------------------------------------------------------------------
section "6) Optional: Client ID/Secret can inspect this token (GitHub OAuth Apps API)"
if [[ -n "${GITHUB_OAUTH_ID:-}" && -n "${GITHUB_OAUTH_SECRET:-}" ]]; then
  CHECK=$(curl -sS -u "${GITHUB_OAUTH_ID}:${GITHUB_OAUTH_SECRET}" \
    -H "Accept: application/vnd.github+json" -A "$UA" \
    -X POST "${API}/applications/${GITHUB_OAUTH_ID}/token" \
    -d "{\"access_token\":\"${GH_TOKEN}\"}" || true)
  echo "$CHECK" | python3 -c '
import sys,json
try:
  d=json.load(sys.stdin)
except Exception as e:
  print("  parse error", e); sys.exit(0)
if d.get("message"):
  print("  GitHub says:", d.get("message"), d.get("documentation_url",""))
else:
  print("  app=", (d.get("app") or {}).get("name") or (d.get("app") or {}).get("client_id"))
  print("  user=", (d.get("user") or {}).get("login"))
  print("  scopes=", d.get("scopes"))
  print("  token_prefix=", (d.get("token") or "")[:4])
' || true
  if echo "$CHECK" | grep -q '"scopes"'; then
    if echo "$CHECK" | grep -q '"repo"'; then
      pass "OAuth App (ID+Secret) recognizes token and scopes include repo"
    else
      fail "OAuth App recognizes token but scopes lack repo: $(echo "$CHECK" | tr -d '\n' | head -c 200)"
    fi
  else
    fail "ID+Secret could not inspect token (wrong secret, or credentials are a GitHub App, or token not from this app)"
    echo "  raw: $(echo "$CHECK" | tr -d '\n' | head -c 300)"
  fi
else
  warn "set GITHUB_OAUTH_ID + GITHUB_OAUTH_SECRET to prove Worker secrets own this token"
fi

# ---------------------------------------------------------------------------
section "7) Repo permission + write probe (user rights through the token)"
curl -sS "${auth[@]}" "${API}/repos/${REPO}" \
  | python3 -c 'import sys,json; r=json.load(sys.stdin); print("  full_name=", r.get("full_name")); print("  permissions=", r.get("permissions")); print("  message=", r.get("message","(ok)"))'
PUSH=$(curl -sS "${auth[@]}" "${API}/repos/${REPO}" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin).get("permissions",{}).get("push") is True)')
if [[ "$PUSH" == "True" ]]; then
  pass "repo permissions.push=true for ${LOGIN}"
else
  fail "repo permissions.push is not true — grant Write collaborator access"
fi

SHA=$(curl -sS "${auth[@]}" "${API}/repos/${REPO}/git/ref/heads/main" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["object"]["sha"])')
echo "  main sha=${SHA}"
CODE=$(curl -sS -o /tmp/oauth-chain-write.json -w "%{http_code}" \
  -X POST "${auth[@]}" \
  "${API}/repos/${REPO}/git/refs" \
  -d "{\"ref\":\"refs/heads/cms-write-test\",\"sha\":\"${SHA}\"}")
echo "  create ref HTTP ${CODE}"
python3 -c 'import json; print(" ", json.load(open("/tmp/oauth-chain-write.json")))' 2>/dev/null || cat /tmp/oauth-chain-write.json

if [[ "${CODE}" == "201" || "${CODE}" == "422" ]]; then
  curl -sS -o /dev/null -X DELETE "${auth[@]}" \
    "${API}/repos/${REPO}/git/refs/heads/cms-write-test" || true
fi

MSG=$(python3 -c 'import json; print(json.load(open("/tmp/oauth-chain-write.json")).get("message",""))' 2>/dev/null || true)

if [[ "${CODE}" == "201" ]]; then
  pass "create-ref works — full chain OK (proxy → OAuth → user write)"
elif [[ "${CODE}" == "403" ]] && echo "${MSG}" | grep -qi 'OAuth App access restrictions'; then
  fail "create-ref 403 — org OAuth App access restrictions block this app"
  echo "  FIX (org owner): approve the OAuth App for springeloo-com:"
  echo "  https://github.com/organizations/springeloo-com/settings/oauth_application_policy"
  echo "  Or: GitHub → Settings → Applications → Authorized OAuth Apps → app →"
  echo "      Organization access → Grant for springeloo-com"
  echo "  After Grant: re-login to /admin/ (or re-run with same token if already granted)."
elif [[ "${CODE}" == "403" ]]; then
  fail "create-ref 403 — ${MSG:0:120}"
  fail "See docs/howto-check-oauth-write.md (wrong app type / empty scopes / org policy)"
else
  fail "create-ref unexpected HTTP ${CODE}"
fi

# ---------------------------------------------------------------------------
section "SUMMARY"
echo "  PASS=${PASS}  FAIL=${FAIL}  WARN=${WARN}"
echo
echo "What the Worker does / does not do:"
echo "  - DOES: exchange GitHub login → user access_token (proxy)"
echo "  - DOES NOT: grant write by itself — rights = token scopes + user role + org approval"
echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "CHAIN OK"
  exit 0
fi
echo "CHAIN BROKEN — fix FAIL lines above, then revoke OAuth app + re-login + re-run."
exit 1
