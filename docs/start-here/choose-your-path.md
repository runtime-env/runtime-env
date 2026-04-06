# Choose your path

## If you use Vite

- Start with `@runtime-env/vite-plugin`.
- The plugin covers dev, build, preview, and Vitest.
- You need to use the CLI during deployment/startup.

Start here: [Vite quickstart](/vite/quickstart).

## If you do not use Vite

- Use `@runtime-env/cli`.
- It is framework-agnostic.
- Use `gen-js`, `gen-ts`, and `interpolate` as needed.

Start here: [CLI quickstart](/cli/quickstart).

## If you want lower-level control even in Vite or other custom workflows

- Use the CLI directly.

## Rule of thumb

- plugin = Vite lifecycle
- CLI = cross-stack low-level tool
