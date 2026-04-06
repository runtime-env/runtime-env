# Vite build

During `vite build`, the plugin enforces runtime config correctness for build output.

## What it does during build

- validates schema,
- enforces required runtime script tag rules,
- generates `src/runtime-env.d.ts` for TypeScript projects.

Build is the end of the Vite lifecycle.

After build, runtime config is handled outside Vite.

Use the CLI when you need generation/interpolation after build:

- [CLI quickstart](/cli/quickstart)
- [gen-js](/cli/gen-js)
- [interpolate](/cli/interpolate)
