# Placeholder in HTML body text

On Vite 6.3.5, a placeholder in body text such as `<div><%= runtimeEnv.VITE_FOO %></div>` makes Vite's HTML parser throw:

```
Unable to parse HTML; parse5 error code invalid-first-character-of-tag-name
```

`test.sh` verifies that:

- `vite build` succeeds and keeps the placeholder in `dist/index.html`.
- `vite preview` and `vite dev` serve the interpolated value.

## Run

```sh
npm ci
npm i ../../../packages/cli/runtime-env-cli-test.tgz
npm i ../../../packages/vite-plugin/runtime-env-vite-plugin-test.tgz
npm test
```
