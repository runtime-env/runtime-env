#!/usr/bin/env bash
set -euo pipefail

start-server-and-test "npm --prefix ../remote run dev" http://localhost:5174 \
  "start-server-and-test 'npm --prefix ../host run dev' http://localhost:5173 'cypress run --config baseUrl=http://localhost:5173 --spec cypress/e2e/dev.cy.ts'"
