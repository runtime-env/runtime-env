## 1. Package Configuration

- [x] 1.1 Update `packages/vite-plugin/package.json` to move `@runtime-env/cli` to `peerDependencies` and `devDependencies`.
- [x] 1.2 Update `packages/vite-plugin/package.json` to add `vite` to `peerDependencies`.

## 2. Verification

- [x] 2.1 Run `npm install` in `packages/vite-plugin` to verify dependency resolution.
- [x] 2.2 Run comprehensive Vite example tests to ensure the plugin still works correctly with peer dependencies.
  - [x] 2.2.1 Test examples/comprehensive-vite (dev)
  - [x] 2.2.2 Test examples/comprehensive-vite (build)
  - [x] 2.2.3 Test examples/comprehensive-vite (preview)
  - [x] 2.2.4 Test examples/comprehensive-vite (test)
