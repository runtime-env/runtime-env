## Why

Vite parses `index.html` with parse5 before the plugin interpolates it. A placeholder in body text such as `<div><%= runtimeEnv.VITE_FOO %></div>` is not valid HTML, so on Vite 6 the parser throws `Unable to parse HTML; parse5 error code invalid-first-character-of-tag-name` in both dev and build. Newer Vite versions only warn.

## What Changes

- Dev: interpolate `index.html` before Vite parses it.
- Build: hide placeholders from Vite's HTML parser and restore them in the emitted HTML, so `dist/index.html` keeps the templates for deploy-time interpolation.
- Add `tests/issues/html-placeholder-in-body/` as a regression test on Vite 6.3.5.

## Capabilities

### Modified Capabilities

- `vite-plugin`: adds support for placeholders anywhere in `index.html`.

## Impact

- `packages/vite-plugin/src/{dev,build}.ts`
- `tests/issues/html-placeholder-in-body/`
- `.github/workflows/ci.yml`
