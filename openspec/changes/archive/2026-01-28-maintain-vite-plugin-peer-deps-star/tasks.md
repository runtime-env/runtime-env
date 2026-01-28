## 1. Specification

- [x] 1.1 Update `vite-plugin` spec to include a scenario for maintaining `*` versions in peer dependencies.

## 2. Implementation

- [x] 2.1 Update `renovate.json` to:
  - Exclude `peerDependencies` from pinning.
  - Set `rangeStrategy` for `devDependencies` to `bump` for `vite-plugin`.
- [x] 2.2 Update `packages/vite-plugin/package.json` `devDependencies` to use `^X.0.0` style.
- [x] 2.3 Verify `packages/vite-plugin/package.json` peer dependencies are still `*`.

## 3. Validation

- [x] 3.1 Run `openspec validate maintain-vite-plugin-peer-deps-star --strict`
