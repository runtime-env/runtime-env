# Troubleshooting

## `runtimeEnv` is undefined

- **What happened:** `/runtime-env.js` was not loaded before your app bundle.
- **Why:** runtime values come from that script.
- **How to fix:** add `<script src="/runtime-env.js"></script>` before your app entry.
- **How to verify:** open devtools and run `runtimeEnv`.

## Schema prefix mismatch

- **What happened:** schema keys do not match Vite env prefix rules.
- **Why:** the plugin checks key prefix rules.
- **How to fix:** rename keys to the configured prefix (default `VITE_`).
- **How to verify:** restart dev server and check for no prefix error.

## `default` in schema rejected

- **What happened:** schema has `default`.
- **Why:** runtime-env does not allow schema defaults.
- **How to fix:** remove `default` and set values with env vars.
- **How to verify:** run `runtime-env gen-js` again.

## `--env-file` fails on older Node

- **What happened:** env file parsing fails.
- **Why:** `--env-file` uses Node `util.parseEnv` (Node 20.12+).
- **How to fix:** update Node or do not use `--env-file`.
- **How to verify:** run `node -v` and run the command again.
