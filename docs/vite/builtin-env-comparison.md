# Vite builtin env comparison

Vite env values are available during dev and statically replaced at build time.

runtime-env adds runtime env support after build without replacing Vite's built-in behavior.

## 1) `runtimeEnv` vs `import.meta.env`

runtime-env intentionally uses `runtimeEnv`.

It does not override or interfere with `import.meta.env`.

This preserves Vite's built-in build-time env replacement while adding runtime env support after build.

## 2) Schema-driven TS generation

runtime-env generates TypeScript declarations directly from the schema.

This reduces mismatch risk between docs, code, schema, and runtime data.

## 3) No env-variable expansion

runtime-env intentionally does not support env-variable expansion in env files.

This avoids behavior that does not match many real production/runtime environments.

Vite also notes caveats around env expansion behavior that can differ from shells and tools like Docker Compose.

Reference: https://vite.dev/guide/env-and-mode
