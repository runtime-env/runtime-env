# Module Federation + runtime-env example

## What this example is

This example shows a **host** app and a **remote** app wired together with Module Federation, where both apps read runtime values from `globalThis.runtimeEnv`.

## Runtime model (important)

- Both host and remote read the same runtime key name: `VITE_MESSAGE`.
- Each app can have its own `.env` values when run standalone.
- When the remote component is rendered inside the host page, it runs in the host page context and reads the host page global: `globalThis.runtimeEnv`.
- That means the host page and the federated remote component display the same runtime value from the host page.

> This example demonstrates page-scoped runtime configuration. When a remote component is rendered inside the host page, it reads the host page's runtime-env global.

## How runtime-env is loaded in host and remote

Both apps use the same runtime-env integration pattern:

- `vite.config.ts` imports `runtimeEnv` from `@runtime-env/vite-plugin` and registers `runtimeEnv()`.
- `index.html` includes `<script src="/runtime-env.js"></script>`.
- visible UI reads `globalThis.runtimeEnv.VITE_MESSAGE`.

## Ports and manifest URLs

### Dev ports

- host: `5173` (Vite default)
- remote: `3000`

### Preview ports

- host: `4173` (Vite default)
- remote: `3000`

### Remote manifest URL used by host

- dev mode: `http://localhost:5174/mf-manifest.json`
- preview/build mode: `http://localhost:4174/mf-manifest.json`

## Create local env files

`.env` files for this example are **local-only** and not committed to git.

Before running either app, copy the example files:

```bash
cp host/.env.example host/.env
cp remote/.env.example remote/.env
```

You can then edit `host/.env` and `remote/.env` to set your own runtime values for standalone runs.

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

## Expected output in host page

With local values like:

- `host/.env`: `VITE_MESSAGE=host-example`
- `remote/.env`: `VITE_MESSAGE=remote-example`

you should see, in the host page:

- `HOST: host-example`
- `Remote: host-example`

(`remote/.env` is used when the remote runs on its own page; inside the host page the remote component reads host page runtime env.)

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
