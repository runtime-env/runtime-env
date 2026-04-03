#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 5 ]]; then
  echo "Usage: $0 <container_name> <image> <env_kv> <url> <test_cmd>" >&2
  exit 1
fi

container_name="$1"
image="$2"
env_kv="$3"
url="$4"
test_cmd="$5"

docker run -d --name "$container_name" -p 3000:80 -e "$env_kv" "$image" >/dev/null

cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
}
trap cleanup EXIT

timeout 120 bash -lc "until curl -sf '$url' >/dev/null; do sleep 1; done"

bash -lc "$test_cmd"
