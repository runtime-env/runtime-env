# Change: Maintain vite-plugin peer dependencies as star (\*) and dev dependencies as major range

## Why

1. Automated dependency management tools (like Renovate) may attempt to pin peer dependencies to specific versions (e.g., commit `ded7009`). However, `@runtime-env/vite-plugin` is designed to be highly compatible with various versions of `vite` and `vitest`. Pinning these peer dependencies unnecessarily restricts consumers and can lead to version conflicts in their projects.
2. The `devDependencies` for `@runtime-env/vite-plugin` (specifically `vite` and `vitest`) should use major version ranges (e.g., `^X.0.0`) to allow for minor and patch updates while staying within a stable major version.

## What Changes

- **MODIFIED** `renovate.json`:
  - Add a package rule to ensure `peerDependencies` are not pinned and remain as `*`.
  - Add a package rule for `@runtime-env/vite-plugin` to ensure `devDependencies` use a `bump` range strategy to maintain `^X.0.0` style ranges.
- **MODIFIED** `openspec/specs/vite-plugin/spec.md`: Add a scenario to the "Peer Dependency Requirements" to explicitly state that these versions must remain `*` and be exempt from automated pinning.
- **MODIFIED** `packages/vite-plugin/package.json`: Update `devDependencies` to use `^X.0.0` ranges.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `renovate.json`, `packages/vite-plugin/package.json`
