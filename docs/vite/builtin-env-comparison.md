# Vite builtin env comparison

## Introduction

Vite exposes environment variables on `import.meta.env`.

Vite's built-in env values are defined in development and statically replaced at build time.

runtime-env is designed to add runtime config support without replacing or interfering with Vite's built-in behavior.

## Similarities

- Both can use `.env` files.
- Both are used to provide config to frontend code.
- Both involve Vite-related conventions around client-visible variables and app configuration.

## Differences

### 1) `runtimeEnv` vs `import.meta.env`

runtime-env intentionally uses `runtimeEnv`.

It does not override or interfere with `import.meta.env`.

The goal is to keep Vite's build-time replacement intact while adding runtime env support after build.

### 2) Schema-driven TS generation

runtime-env can generate TypeScript declarations directly from your schema.

This reduces mismatch risk between docs, code, schema, and runtime data.

Compared with built-in env typing, this is more schema-driven and less manual.

### 3) No env-variable expansion

runtime-env does not support env-variable expansion inside env files.

This is intentional because many real production runtime environments do not support that style of expansion.

Vite documents env expansion support (including reverse-order expansion), but also recommends avoiding reliance on it because shell scripts and tools like Docker Compose do not support that behavior consistently and future warnings may be added.

Reference: https://vite.dev/guide/env-and-mode

## When to use which

- Use `import.meta.env` for normal Vite build-time env replacement.
- Use `runtimeEnv` for values that must be resolved at runtime after build.
- Use both together when you need both build-time and runtime configuration in one app.
