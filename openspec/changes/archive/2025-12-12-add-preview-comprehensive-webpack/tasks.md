## 1. Implementation

- [x] Add preview script to examples/comprehensive-webpack/package.json
- [x] Add minimal preview config and instructions in examples/comprehensive-webpack/README.md
- [x] Add example preview command to repo-level examples documentation (if present) — skipped (no repo-level examples doc present)
- [x] Add Cypress E2E test `cypress/e2e/preview.cy.js` for comprehensive-webpack mirroring comprehensive-vite
- [x] Add CI workflow step "Test examples/comprehensive-webpack (preview)" using `start-server-and-test` to run preview tests twice with different `.env` values
- [x] Run local verification and update tasks.md with any follow-ups

## 2. Validation

- [x] Run openspec validate add-preview-comprehensive-webpack --strict
- [x] Get proposal reviewed and approved
