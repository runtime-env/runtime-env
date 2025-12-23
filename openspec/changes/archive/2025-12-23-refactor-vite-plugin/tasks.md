## 1. Refactoring

- [x] 1.1. Fetch and analyze the Vite plugin authoring guide at `https://vite.dev/guide/api-plugin`.
- [x] 1.2. Analyze the current implementation in `packages/vite-plugin/src/index.ts`.
- [x] 1.3. Create a `design.md` to propose the new file structure and how logic will be separated by mode.

## 2. Implementation

- [x] 2.1. Create the new file structure in `packages/vite-plugin/src` as defined in the `design.md`.
- [x] 2.2. Move `serve` (dev) related logic to its own file.
- [x] 2.3. Move `build` related logic to its own file.
- [x] 2.4. Move `preview` related logic to its own file.
- [x] 2.5. Move `vitest` related logic to its own file.
- [x] 2.6. Update `src/index.ts` to import and use the new mode-specific modules.

## 3. Verification

### 3.1 Dev Mode

- [x] 3.1.1 Current directory is the root of the repo, and ensure the following steps are done without errors:
- [x] 3.1.2 Run `git clean -xdf && git restore . && npm ci`.
- [x] 3.1.3 Run `npm install` in the root.
- [x] 3.1.4 Run `npm run build` in the root.
- [x] 3.1.5 Run `npm run pack` in the root.
- [x] 3.1.6 Navigate to `examples/comprehensive-vite`.
- [x] 3.1.7 npm ci
- [x] 3.1.8 npm i ../../packages/cli/runtime-env-cli-test.tgz
- [x] 3.1.9 npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
- [x] 3.1.10 echo "FOO=dev-initial" > .env
- [x] 3.1.11 npx start-server-and-test dev http://localhost:5173 'npx cypress run --config baseUrl=http://localhost:5173 --spec cypress/e2e/dev.cy.js'

### 3.2 Test Mode

- [x] 3.2.1 Current directory is the root of the repo, and ensure the following steps are done without errors:
- [x] 3.2.2 Run `git clean -xdf && git restore . && npm ci`.
- [x] 3.2.3 Run `npm install` in the root.
- [x] 3.2.4 Run `npm run build` in the root.
- [x] 3.2.5 Run `npm run pack` in the root.
- [x] 3.2.6 Navigate to `examples/comprehensive-vite`.
- [x] 3.2.7 npm ci
- [x] 3.2.8 npm i ../../packages/cli/runtime-env-cli-test.tgz
- [x] 3.2.9 npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
- [x] 3.2.10 echo "FOO=test-value" > .env
- [x] 3.2.11 npm run test

### 3.3 Preview Mode

- [x] 3.3.1 Current directory is the root of the repo, and ensure the following steps are done without errors:
- [x] 3.3.2 Run `git clean -xdf && git restore . && npm ci`.
- [x] 3.3.3 Run `npm install` in the root.
- [x] 3.3.4 Run `npm run build` in the root.
- [x] 3.3.5 Run `npm run pack` in the root.
- [x] 3.3.6 Navigate to `examples/comprehensive-vite`.
- [x] 3.3.7 npm ci
- [x] 3.3.8 npm i ../../packages/cli/runtime-env-cli-test.tgz
- [x] 3.3.9 npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
- [x] 3.3.10 npm run build
- [x] 3.3.11 echo "FOO=preview-initial" > .env
- [x] 3.3.12 npx start-server-and-test preview http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_FOO=preview-initial --spec cypress/e2e/preview.cy.js'
- [x] 3.3.13 echo "FOO=preview-updated" > .env
- [x] 3.3.14 npx start-server-and-test preview http://localhost:4173 'npx cypress run --config baseUrl=http://localhost:4173 --env EXPECTED_FOO=preview-updated --spec cypress/e2e/preview.cy.js'

### 3.4 Docker Mode

- [x] 3.4.1 Current directory is the root of the repo, and ensure the following steps are done without errors:
- [x] 3.4.2 Run `git clean -xdf && git restore . && npm ci`.
- [x] 3.4.3 Run `npm install` in the root.
- [x] 3.4.4 Run `npm run build` in the root.
- [x] 3.4.5 Run `npm run pack` in the root.
- [x] 3.4.6 Navigate to `examples/comprehensive-vite`.
- [x] 3.4.7 npm ci
- [x] 3.4.8 cp ../../packages/cli/runtime-env-cli-test.tgz .
- [x] 3.4.9 cp ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz .
- [x] 3.4.10 docker build -t comprehensive-vite .
- [x] 3.4.11 npx start-server-and-test 'docker run -p 3000:80 -e FOO=docker-initial comprehensive-vite' 3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-initial --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-vite -q | xargs docker rm -f
- [x] 3.4.12 npx start-server-and-test 'docker run -p 3000:80 -e FOO=docker-updated comprehensive-vite' 3000 'npx cypress run --config baseUrl=http://localhost:3000 --env EXPECTED_FOO=docker-updated --spec cypress/e2e/docker.cy.js' && docker ps -f ancestor=comprehensive-vite -q | xargs docker rm -f
