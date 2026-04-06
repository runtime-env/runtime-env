# Vite build

During `vite build`, the plugin enforces runtime config correctness for build output.

## What it does during build

- validates schema,
- enforces the required runtime script tag and base-aware path,
- generates `src/runtime-env.d.ts` for TypeScript projects.

Build is the end of the Vite lifecycle.

Real deployment/runtime generation and interpolation are handled later by the CLI.
