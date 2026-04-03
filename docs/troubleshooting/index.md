# Troubleshooting

## `runtimeEnv` is undefined

- **What happened:** `/runtime-env.js` was not loaded before your app bundle.
- **Why:** runtime values are provided by that script.
- **How to fix:** add `<script src="/runtime-env.js"></script>` before your entry script.
- **How to verify:** open browser devtools and run `runtimeEnv`.

## Schema prefix mismatch

- **What happened:** schema keys do not follow Vite env prefix rules.
- **Why:** Vite plugin enforces prefix compatibility for runtime keys.
- **How to fix:** rename keys to use configured prefix (default `VITE_`).
- **How to verify:** restart dev server and confirm no validation errors.

## `default` in schema rejected

- **What happened:** schema includes `default`.
- **Why:** runtime-env forbids schema defaults.
- **How to fix:** remove `default` and provide values via env vars.
- **How to verify:** rerun `runtime-env gen-js`.

## `--env-file` fails on older Node

- **What happened:** parsing env files fails.
- **Why:** `--env-file` uses Node `util.parseEnv` (Node 20.12+).
- **How to fix:** upgrade Node or avoid `--env-file`.
- **How to verify:** run `node -v` and rerun command.
