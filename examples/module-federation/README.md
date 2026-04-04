# Module Federation + runtime-env example

## What this example is

This example shows a **host** app and a **remote** app wired together with Module Federation, where both apps read runtime values through `runtime-env`.

## What it proves

- The host renders `HOST: ...` using `globalThis.runtimeEnv.VITE_MESSAGE`.
- The remote renders `Remote: ...` using `globalThis.runtimeEnv.VITE_MESSAGE`.
- Both apps use the same runtime key (`VITE_MESSAGE`) but resolve values from each app's own `.env` file.
- Changing `.env` values updates what users see without changing source code.

## Tech stack used in this implementation

This implementation uses **Vite + React + TypeScript** for both host and remote so the example is easy to run locally.

Module Federation is not conceptually limited to this stack; this repo just demonstrates one concrete setup that integrates with `runtime-env`.

## How runtime-env is loaded in host and remote

Both apps use the same runtime-env integration pattern:

- `vite.config.ts` imports `runtimeEnv` from `@runtime-env/vite-plugin` and registers `runtimeEnv()`.
- `index.html` includes `<script src="/runtime-env.js"></script>`.
- visible UI reads `globalThis.runtimeEnv.VITE_MESSAGE`.

## Ports and manifest URLs

### Dev ports

- host: `5173` (Vite default)
- remote: `5174`

### Preview ports

- host: `4173` (Vite default)
- remote: `4174`

### Remote manifest URL used by host

- dev mode: `http://localhost:5174/mf-manifest.json`
- preview/build mode: `http://localhost:4174/mf-manifest.json`

## How to run the example

Use two terminals.

Terminal 1 (remote):

```bash
cd examples/module-federation/remote
npm ci
npm install @runtime-env/cli @runtime-env/vite-plugin
npm run dev
```

Terminal 2 (host):

```bash
cd examples/module-federation/host
npm ci
npm install @runtime-env/cli @runtime-env/vite-plugin
npm run dev
```

Open `http://localhost:5173`.

## Expected output

With default `.env` files in this example, you should see:

- `HOST: host-example`
- `Remote: remote-example`

## For runtime-env contributors

The `test/` package is a coordinator for automated verification (Cypress + start-server-and-test).

For repo-local verification against current-commit tarballs, install package deps in `host`, `remote`, and `test`, then install:

- `../../../packages/cli/runtime-env-cli-test.tgz`
- `../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz`

into both `host` and `remote`, and run:

```bash
cd examples/module-federation/test
npm test
```
