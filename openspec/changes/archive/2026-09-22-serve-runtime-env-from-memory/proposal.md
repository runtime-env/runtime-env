## Why

The dev, preview, and Vitest plugins write `runtime-env.js` and the interpolated `index.html` to `node_modules/.runtime-env/<random>/` and rely on `signal-exit` to remove the directory. Under `pnpm run dev`, pressing Ctrl+C often leaves the directory behind: `signal-exit` restores the default `SIGINT` action before deleting, and pnpm forwards a second `SIGINT` to the child, which kills Vite mid-cleanup.

## What Changes

- The CLI `interpolate` command SHALL read its input from stdin when neither `--input-file` nor a positional input is given.
- The dev and preview plugins SHALL run `gen-js` and `interpolate` without `--output-file` and without `--input-file`, passing HTML through stdin and keeping stdout in memory.
- The Vitest plugin SHALL append the virtual module `virtual:runtime-env.js` to `config.test.setupFiles` and serve the `gen-js` stdout through `resolveId`/`load`.
- The plugin SHALL NOT create `node_modules/.runtime-env/`.
- The plugin requires the CLI version that ships stdin support for `interpolate`.
- `signal-exit` is removed from the plugin's dependencies.

## Capabilities

### Modified Capabilities

- `cli`: `interpolate` reads stdin when no input is given.
- `vite-plugin`: Clean Project Root no longer uses temp directories; the Vitest scenario uses a virtual setup module.

## Impact

- `packages/cli/src/interpolate/command.ts`, `docs/cli/interpolate.md`, `docs/cli/troubleshooting.md`
- `packages/vite-plugin/src/{utils,build,dev,preview,vitest}.ts`
- `packages/vite-plugin/package.json`: removes `signal-exit`.
