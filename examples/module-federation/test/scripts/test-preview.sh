#!/usr/bin/env bash
set -euo pipefail

npm --prefix ../host run build
npm --prefix ../remote run build

echo "VITE_MESSAGE=host-preview-initial" > ../host/.env
echo "VITE_MESSAGE=remote-preview-initial" > ../remote/.env

start-server-and-test "npm --prefix ../remote run preview" http://localhost:4174 \
  "start-server-and-test 'npm --prefix ../host run preview' http://localhost:4173 'cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_HOST=host-preview-initial,EXPECTED_REMOTE=remote-preview-initial --spec cypress/e2e/preview.cy.ts'"

echo "VITE_MESSAGE=host-preview-updated" > ../host/.env
echo "VITE_MESSAGE=remote-preview-updated" > ../remote/.env

start-server-and-test "npm --prefix ../remote run preview" http://localhost:4174 \
  "start-server-and-test 'npm --prefix ../host run preview' http://localhost:4173 'cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_HOST=host-preview-updated,EXPECTED_REMOTE=remote-preview-updated --spec cypress/e2e/preview.cy.ts'"
