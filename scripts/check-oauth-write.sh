#!/usr/bin/env bash
# Verify a Decap GitHub OAuth user token can write to website-2026.
# Usage:
#   export GH_TOKEN='gho_...'
#   bash scripts/check-oauth-write.sh
set -euo pipefail

REPO="${REPO:-springeloo-com/website-2026}"
API="${API:-https://api.github.com}"

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "Set GH_TOKEN to the Decap session token (see docs/howto-check-oauth-write.md)."
  exit 1
fi

PREFIX="${GH_TOKEN:0:4}"
case "$PREFIX" in
  gho_) KIND="classic OAuth user token (expected for Decap)" ;;
  ghu_) KIND="GitHub App user-to-server token (WRONG for Decap OAuth App flow)" ;;
  ghs_) KIND="GitHub App installation token (WRONG)" ;;
  ghp_) KIND="classic PAT (not from Decap OAuth)" ;;
  github_pat_*) KIND="fine-grained PAT (not from Decap OAuth)" ;;
  *) KIND="unknown prefix '${PREFIX}…' — check you copied the raw access_token" ;;
esac

auth=(-H "Authorization: token ${GH_TOKEN}" -H "Accept: application/vnd.github+json")

echo "== 0) Token type =="
echo "prefix=${PREFIX}…  → ${KIND}"
echo "length=${#GH_TOKEN}"
echo

echo "== 1) Token scopes =="
HEADERS=$(curl -sS -I "${auth[@]}" "${API}/user" || true)
echo "$HEADERS" | grep -iE '^(HTTP|x-oauth-scopes|x-accepted-oauth-scopes|x-github-media-type):' || true
SCOPES=$(echo "$HEADERS" | awk -F': ' 'tolower($1)=="x-oauth-scopes" {print $2}' | tr -d '\r')
echo "parsed x-oauth-scopes=[${SCOPES}]"
if [[ -z "${SCOPES// /}" ]]; then
  echo "WARN: empty scopes — classic Decap OAuth tokens must list 'repo' here."
  echo "      Empty scopes usually means GitHub App token, fine-grained PAT,"
  echo "      or OAuth authorize URL missing scope=repo,user."
fi
echo

echo "== 2) User =="
LOGIN=$(curl -sS "${auth[@]}" "${API}/user" | python3 -c 'import sys,json; print(json.load(sys.stdin)["login"])')
echo "login=${LOGIN}"
echo

echo "== 3) Repo permissions =="
curl -sS "${auth[@]}" "${API}/repos/${REPO}" \
  | python3 -c 'import sys,json; r=json.load(sys.stdin); print("full_name=", r.get("full_name")); print("permissions=", r.get("permissions")); print("message=", r.get("message","(ok)"))'
echo
echo "NOTE: permissions.push=true is necessary but NOT sufficient."
echo "      Create-ref can still 403 if the token is an App/integration token"
echo "      or the org blocks the OAuth App for writes."
echo

echo "== 4) Write probe (create+delete cms-write-test branch) =="
SHA=$(curl -sS "${auth[@]}" "${API}/repos/${REPO}/git/ref/heads/main" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["object"]["sha"])')
echo "main sha=${SHA}"

CODE=$(curl -sS -o /tmp/gh-write.json -w "%{http_code}" \
  -X POST "${auth[@]}" \
  "${API}/repos/${REPO}/git/refs" \
  -d "{\"ref\":\"refs/heads/cms-write-test\",\"sha\":\"${SHA}\"}")
echo "create ref HTTP ${CODE}"
python3 -c 'import json; print(json.load(open("/tmp/gh-write.json")))' 2>/dev/null || cat /tmp/gh-write.json
echo

if [[ "${CODE}" == "201" || "${CODE}" == "422" ]]; then
  DEL=$(curl -sS -o /dev/null -w "%{http_code}" -X DELETE "${auth[@]}" \
    "${API}/repos/${REPO}/git/refs/heads/cms-write-test" || true)
  echo "delete ref HTTP ${DEL}"
fi

echo
if [[ "${CODE}" == "201" ]]; then
  echo "PASS: token can create refs — Decap editorial save should work."
  exit 0
fi

echo "FAIL: HTTP ${CODE}"
echo
echo "Interpretation for your common case (empty scopes + 403 integration):"
echo "  1) Token must start with gho_ and x-oauth-scopes must include 'repo'."
echo "  2) Use a GitHub *OAuth App* (Developer settings → OAuth Apps), NOT a GitHub App."
echo "  3) Worker /auth URL must include scope=repo,user — then revoke + re-login."
echo "  4) Org owner must approve the OAuth App:"
echo "     https://github.com/organizations/springeloo-com/settings/oauth_application_policy"
echo "See docs/howto-check-oauth-write.md"
exit 2
