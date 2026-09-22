#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

vite="node node_modules/vite/bin/vite.js"

fail() {
  echo "FAIL: $1"
  exit 1
}

serve() {
  local command=$1 port=$2
  $vite $command --port "$port" --strictPort >/dev/null 2>&1 &
  local pid=$!
  for _ in $(seq 1 60); do
    curl -s -o /dev/null "http://localhost:$port/" && break
    sleep 0.5
  done
  local html
  html=$(curl -s "http://localhost:$port/")
  kill "$pid"
  wait "$pid" 2>/dev/null || true
  grep -q "<div>issue-value</div>" <<<"$html" || fail "$command does not interpolate a placeholder in body text"
}

echo "VITE_FOO=issue-value" >.env
trap 'rm -f .env' EXIT

$vite build || fail "build fails on a placeholder in body text"
grep -q "<div><%= runtimeEnv.VITE_FOO %></div>" dist/index.html || fail "build does not preserve a placeholder in body text"

serve preview 4271
serve dev 5271

echo "PASS"
