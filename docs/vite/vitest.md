# Vite Vitest

In Vitest mode, the plugin keeps test runtime config behavior aligned with app runtime expectations.

## What it does in Vitest

- validates schema before tests run,
- generates runtime setup data for tests,
- injects setup-file configuration automatically,
- generates `src/runtime-env.d.ts` for TypeScript projects.

## Testing guidance

- If runtime values are missing in tests, verify your schema keys and env values first.
- Keep test env inputs explicit to avoid hidden machine-level differences.
- For non-Vite tests or custom runners, use the CLI directly to generate runtime data before tests.
