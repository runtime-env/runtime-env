## 1. Implementation

- [x] 1.1 Refactor `devPlugin` to serve `runtime-env.js` via middleware.
- [x] 1.2 Refactor `vitestPlugin` to automatically update `config.test.setupFiles`.
- [x] 1.3 Refactor `buildPlugin` to remove `public/runtime-env.js cleanup logic.

## 2. Verification

- [x] 2.1 Verify `dev` mode in `comprehensive-vite` (check if `/runtime-env.js` is served and `public/runtime-env.js` is NOT created).
- [x] 2.2 Verify `vitest` mode in `comprehensive-vite` (check if tests pass without manual `setupFiles`).
- [x] 2.3 Verify `build` and `preview` modes in `comprehensive-vite` to ensure no regression.
