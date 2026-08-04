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

auth=(-H "Authorization: token ${GH_TOKEN}" -H "Accept: application/vnd.github+json")

echo "== 1) Token scopes =="
curl -sS -I "${auth[@]}" "${API}/user" | grep -iE '^(HTTP|x-oauth-scopes|x-accepted-oauth-scopes):' || true
echo

echo "== 2) User =="
LOGIN=$(curl -sS "${auth[@]}" "${API}/user" | python3 -c 'import sys,json; print(json.load(sys.stdin)["login"])')
echo "login=${LOGIN}"
echo

echo "== 3) Repo permissions =="
curl -sS "${auth[@]}" "${API}/repos/${REPO}" \
  | python3 -c 'import sys,json; r=json.load(sys.stdin); print("full_name=", r.get("full_name")); print("permissions=", r.get("permissions")); print("message=", r.get("message","(ok)"))'
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
elif [[ "${CODE}" == "403" ]]; then
  echo "FAIL: 403 — approve OAuth App for org and/or grant Write; see docs/howto-check-oauth-write.md"
  exit 2
else
  echo "FAIL: unexpected HTTP ${CODE} — see docs/howto-check-oauth-write.md"
  exit 3
fi
