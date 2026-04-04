#!/usr/bin/env bash
set -euo pipefail

npm --prefix ../host run build
npm --prefix ../remote run build

echo "VITE_MESSAGE=host-preview-initial" > ../host/.env

npx start-server-and-test \
  "npm --prefix ../remote run preview" \
  http://localhost:4174 \
  "npx start-server-and-test 'npm --prefix ../host run preview' http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_HOST=host-preview-initial,EXPECTED_REMOTE=host-preview-initial --spec cypress/e2e/preview.cy.ts'"

echo "VITE_MESSAGE=host-preview-updated" > ../host/.env

npx start-server-and-test \
  "npm --prefix ../remote run preview" \
  http://localhost:4174 \
  "npx start-server-and-test 'npm --prefix ../host run preview' http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_HOST=host-preview-updated,EXPECTED_REMOTE=host-preview-updated --spec cypress/e2e/preview.cy.ts'"
