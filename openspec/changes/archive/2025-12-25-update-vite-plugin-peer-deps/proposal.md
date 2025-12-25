# Change: Use peer dependencies for CLI and Vite in vite-plugin

## Why

The `@runtime-env/vite-plugin` currently lists `@runtime-env/cli` as a direct dependency. Since the plugin is an extension of both Vite and the `@runtime-env/cli`, it should treat them as peer dependencies. This prevents version conflicts, reduces package size for consumers who already have these dependencies, and follows industry standards for Vite plugins.

## What Changes

- **MODIFIED** `packages/vite-plugin/package.json`:
  - Move `@runtime-env/cli` from `dependencies` to `peerDependencies` with version `*`.
  - Add `@runtime-env/cli` to `devDependencies` to support local development and testing.
  - Add `vite` to `peerDependencies` with version `*`.
- **MODIFIED** `openspec/specs/vite-plugin/spec.md`:
  - Add a requirement specifying that the plugin expects `vite` and `@runtime-env/cli` as peer dependencies with specific version constraints.

## Impact

- Users of `@runtime-env/vite-plugin` MUST ensure `@runtime-env/cli` and `vite` are installed in their project.
- No breaking changes to functionality, only to dependency management.
