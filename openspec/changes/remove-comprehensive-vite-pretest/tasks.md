## 1. Implementation

- [ ] 1.1. Remove the `pretest` script from `examples/comprehensive-vite/package.json`.
- [ ] 1.2. Analyze the impact of removing `pretest` on `@runtime-env/vite-plugin`.
- [ ] 1.3. If needed, modify `@runtime-env/vite-plugin` to ensure the testing workflow remains seamless without the `pretest` script.

## 2. Testing

- [ ] 2.1. Run `npm install` in the root.
- [ ] 2.2. Run `npm run build` in the root.
- [ ] 2.3. Run `npm run pack` in the root.
- [ ] 2.4. Navigate to `examples/comprehensive-vite`.
- [ ] 2.5. Run `git clean -xdf && git restore . && npm ci` to ensure a clean state and install dependencies.
- [ ] 2.6. Run `npm i ../../packages/cli/runtime-env-cli-test.tgz`.
- [ ] 2.7. Run `npm i ../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz`.
- [ ] 2.8. Run `echo "FOO=test-value" > .env`.
- [ ] 2.9. Run `npm run test` and ensure all tests pass. This confirms that `vitest --run` (which `npm run test` executes) does not rely on `pretest` for a successful build.
