#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

cleanup() {
  local code=$?
  # Stop any leftover dev/preview servers started by start-server-and-test.
  pkill -f "vite( preview|$)" >/dev/null 2>&1 || true
  pkill -f "webpack serve" >/dev/null 2>&1 || true
  pkill -f "serve dist -l 8080" >/dev/null 2>&1 || true
  pkill -f "runtime-env --watch" >/dev/null 2>&1 || true
  if [[ $code -ne 0 ]]; then
    echo "\n❌ Local CI runner failed." >&2
  fi
}
trap cleanup EXIT

run() {
  local name="$1"
  shift
  echo "\n==== $name ===="
  timeout --foreground 20m "$@"
}

run_in_dir() {
  local name="$1"
  local dir="$2"
  shift 2
  run "$name" bash -lc "cd '$dir' && $*"
}

docker_available() {
  command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1
}

# Core jobs: build, lint, test
run "Install dependencies" npm ci
run "Build packages" npm run build
run "Pack packages" npm run pack
run "Check formatting" npx prettier --check .
run "Test packages" npm run test

# Example: development
run_in_dir "Test examples/development" "examples/development" \
  "npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm run test"

# Example: test
run_in_dir "Test examples/test" "examples/test" \
  "npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm run test"

# Example: comprehensive-vite (dev/test/preview)
run_in_dir "Test examples/comprehensive-vite (dev)" "examples/comprehensive-vite" \
  "npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz && echo 'VITE_FOO=dev-initial' > .env && npx start-server-and-test dev http://localhost:5173 'npx cypress run --config baseUrl=http://localhost:5173 --spec cypress/e2e/dev.cy.js'"

run_in_dir "Test examples/comprehensive-vite (test)" "examples/comprehensive-vite" \
  "git clean -xdf && git restore . && npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz && echo 'VITE_FOO=test-value' > .env && npm run test"

run_in_dir "Test examples/comprehensive-vite (preview)" "examples/comprehensive-vite" \
  "git clean -xdf && git restore . && npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz && npm run build && echo 'VITE_FOO=preview-initial' > .env && npx start-server-and-test preview http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_FOO=preview-initial --spec cypress/e2e/preview.cy.js' && echo 'VITE_FOO=preview-updated' > .env && npx start-server-and-test preview http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_FOO=preview-updated --spec cypress/e2e/preview.cy.js'"

# Example: comprehensive-webpack (dev/test/preview)
run_in_dir "Test examples/comprehensive-webpack (dev)" "examples/comprehensive-webpack" \
  "npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && echo 'FOO=dev-initial' > .env && npx start-server-and-test dev http://localhost:8080 'npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/dev.cy.js'"

run_in_dir "Test examples/comprehensive-webpack (test)" "examples/comprehensive-webpack" \
  "git clean -xdf && git restore . && npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && echo 'FOO=test-value' > .env && npm run test"

run_in_dir "Test examples/comprehensive-webpack (preview)" "examples/comprehensive-webpack" \
  "git clean -xdf && git restore . && npm ci && npm i ../../packages/cli/runtime-env-cli-test.tgz && npm run build && echo 'FOO=preview-initial' > .env && npx start-server-and-test preview http://localhost:8080 'npx cypress run --config baseUrl=http://localhost:8080 --env EXPECTED_FOO=preview-initial --spec cypress/e2e/preview.cy.js' && echo 'FOO=preview-updated' > .env && npx start-server-and-test preview http://localhost:8080 'npx cypress run --config baseUrl=http://localhost:8080 --env EXPECTED_FOO=preview-updated --spec cypress/e2e/preview.cy.js'"

# Docker-based jobs (optional in containerized local environments)
if docker_available; then
  run_in_dir "Test examples/production" "examples/production" \
    "npm ci && cp ../../packages/cli/runtime-env-cli-test.tgz . && docker build . -t runtime-env-example && npm run test"

  run_in_dir "Test examples/workbox" "examples/workbox" \
    "npm ci && cp ../../packages/cli/runtime-env-cli-test.tgz . && docker build . -t runtime-env-example && npm run test"

  run_in_dir "Test examples/comprehensive-vite (docker)" "examples/comprehensive-vite" \
    "git clean -xdf && git restore . && npm ci && cp ../../packages/cli/runtime-env-cli-test.tgz . && cp ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz . && docker build -t comprehensive-vite . && npx start-server-and-test 'docker run -p 3000:80 -e VITE_FOO=docker-initial comprehensive-vite' http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-initial --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-vite -q | xargs -r docker rm -f && npx start-server-and-test 'docker run -p 3000:80 -e VITE_FOO=docker-updated comprehensive-vite' http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-updated --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-vite -q | xargs -r docker rm -f"

  run_in_dir "Test examples/comprehensive-webpack (docker)" "examples/comprehensive-webpack" \
    "git clean -xdf && git restore . && npm ci && cp ../../packages/cli/runtime-env-cli-test.tgz . && docker build -t comprehensive-webpack . && npx start-server-and-test 'docker run -p 3000:80 -e FOO=docker-initial comprehensive-webpack' http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-initial --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-webpack -q | xargs -r docker rm -f && npx start-server-and-test 'docker run -p 3000:80 -e FOO=docker-updated comprehensive-webpack' http://localhost:3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-updated --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-webpack -q | xargs -r docker rm -f"
else
  echo "\n⚠️  Docker daemon not available; skipping docker-based CI jobs."
fi

echo "\n✅ Local CI job emulation completed."
