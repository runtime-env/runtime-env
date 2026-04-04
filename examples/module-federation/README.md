# Module Federation example (for runtime-env maintainers)

This example is a **repository integration fixture** for validating `runtime-env` with Vite Module Federation.

It lives under `examples/module-federation` and is meant for contributors working on this repository (not as a standalone end-user quickstart).

## What this fixture verifies

- Host and remote are separate React + TypeScript Vite apps.
- Both apps read the same runtime key name: `VITE_MESSAGE`.
- Each app resolves that key from its own runtime source (`host/.env` vs `remote/.env`).
- Host renders `HOST: <value>`.
- Remote renders `Remote: <value>`.
- Host renders the remote through Module Federation.
- No `shared` folder and no `shared` federation config are used.

## Required runtime-env integration pattern (both apps)

- `vite.config.ts`: `runtimeEnv()` from `@runtime-env/vite-plugin`
- `index.html`: `<script src="/runtime-env.js"></script>`
- app code: `globalThis.runtimeEnv.VITE_MESSAGE`

## Ports and manifests

### Dev
- host: `5173` (default Vite dev port)
- remote: `5174`
- host loads remote manifest from `http://localhost:5174/mf-manifest.json`

### Preview
- host: `4173` (default Vite preview port)
- remote: `4174`
- built host loads remote manifest from `http://localhost:4174/mf-manifest.json`

## Maintainer setup (use local packages from current commit)

From repo root:

```bash
npm ci
npm run build
npm run pack
```

Install example dependencies:

```bash
cd examples/module-federation/host && npm ci
cd ../remote && npm ci
cd ../test && npm ci
```

Install locally packed runtime-env artifacts into both apps:

```bash
cd examples/module-federation/host
npm i ../../../packages/cli/runtime-env-cli-test.tgz
npm i ../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz

cd ../remote
npm i ../../../packages/cli/runtime-env-cli-test.tgz
npm i ../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
```

## Manual run (two terminals)

Terminal 1:

```bash
cd examples/module-federation/remote
npm run dev
```

Terminal 2:

```bash
cd examples/module-federation/host
npm run dev
```

Open `http://localhost:5173` and confirm:

- `HOST: host-example`
- `Remote: remote-example`

## Automated verification used by CI

```bash
cd examples/module-federation/test
npm test
```

The coordinator runs integrated Cypress dev + preview E2E checks (including preview runtime reconfiguration without rebuilding).
