## 1. Implementation

- [x] 1.1 Add `signal-exit` as a dependency of `@runtime-env/vite-plugin`.
- [x] 1.2 Add a helper in `utils.ts` that creates `node_modules/.runtime-env/<random>/` with `mkdtempSync` and registers its removal with `signal-exit`'s `onExit`.
- [x] 1.3 Dev: create the directory in `configureServer`, write `runtime-env.js` and `index.html` there, drop the per-transform `rmSync`, and remove the directory in `closeBundle`.
- [x] 1.4 Preview: create the directory in `configurePreviewServer`, write `runtime-env.js` and `index.html` there, and drop the per-request `rmSync`.
- [x] 1.5 Vitest: create the directory in `config()`, generate `runtime-env.js` there in `configResolved`, and drop the startup `rmSync`.

## 2. Verification

- [x] 2.1 Run existing vite-plugin tests and e2e examples.
