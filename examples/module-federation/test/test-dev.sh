#!/usr/bin/env bash
set -euo pipefail

echo "VITE_MESSAGE=host-example" > ../host/.env
echo "VITE_MESSAGE=remote-example" > ../remote/.env

npx start-server-and-test \
  "npm --prefix ../remote run dev" \
  http://localhost:5174/mf-manifest.json \
  "npx start-server-and-test 'npm --prefix ../host run dev' http://localhost:5173 'npx cypress run --config baseUrl=http://localhost:5173 --spec cypress/e2e/dev.cy.ts'"
