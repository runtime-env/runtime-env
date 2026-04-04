# Module Federation + runtime-env (Vite, React, TypeScript)

This example demonstrates two separate Vite apps (a **host** and a **remote**) using Module Federation and `runtime-env`.

Both apps read the same key name, `VITE_MESSAGE`, via runtime env, but each app resolves its value from its own `.env` file.

## What this proves

- Host reads `globalThis.runtimeEnv.VITE_MESSAGE` and renders `HOST: ...`.
- Remote reads `globalThis.runtimeEnv.VITE_MESSAGE` and renders `Remote: ...`.
- Host loads the remote with Module Federation, so both lines appear together.
- Host and remote can show different values for the same key (`VITE_MESSAGE`).

## Runtime env integration used in both apps

- `vite.config.ts`: `import runtimeEnv from "@runtime-env/vite-plugin"` and `runtimeEnv()` in `plugins`.
- `index.html`: `<script src="/runtime-env.js"></script>`.
- App code reads `globalThis.runtimeEnv.VITE_MESSAGE`.

## App structure

- `host/` — React + TypeScript host app
- `remote/` — React + TypeScript remote app
- `test/` — Cypress E2E coordinator package only

## Ports

### Dev
- host: `5173`
- remote: `5174`

### Preview
- host: `4173`
- remote: `4174`

## Module Federation manifest URLs

- In dev, host loads remote from `http://localhost:5174/mf-manifest.json`.
- In preview (built output), host loads remote from `http://localhost:4174/mf-manifest.json`.

## Local setup with repo tarballs

From repository root (`runtime-env/runtime-env`):

```bash
npm ci
npm run build
npm run pack
```

Install dependencies for each package:

```bash
cd examples/module-federation/host && npm ci
cd ../remote && npm ci
cd ../test && npm ci
```

Install local runtime-env tarballs into host and remote (not npm registry packages):

```bash
cd examples/module-federation/host
npm i ../../../packages/cli/runtime-env-cli-test.tgz
npm i ../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz

cd ../remote
npm i ../../../packages/cli/runtime-env-cli-test.tgz
npm i ../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
```

## Run manually (two terminals)

Terminal 1 (remote):

```bash
cd examples/module-federation/remote
npm run dev
```

Terminal 2 (host):

```bash
cd examples/module-federation/host
npm run dev
```

Then open `http://localhost:5173`.

Expected initial output:

- `HOST: host-example`
- `Remote: remote-example`

## Automated verification

```bash
cd examples/module-federation/test
npm test
```

This runs integrated Cypress E2E for both dev and preview behavior.
