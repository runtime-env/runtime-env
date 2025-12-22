# Change: Remove 'pretest' script from comprehensive-vite example

## Why

The `examples/comprehensive-vite` project includes a `pretest` script that runs `npm run build` before executing tests. The primary test command for Vite projects is `vitest run`, and users should not be expected to alter their standard workflow to accommodate our plugin. By removing the `pretest` script, we ensure that `@runtime-env/vite-plugin` works seamlessly within the existing Vite ecosystem without imposing additional build steps on the user. This change reinforces the goal of providing a zero-configuration, native-feeling developer experience.

## What Changes

- The `pretest` script will be removed from `examples/comprehensive-vite/package.json`.
- Any necessary adjustments to maintain a seamless workflow will be made in the `@runtime-env/vite-plugin`.

## Impact

- Affected specs: `comprehensive-examples-simplification` will be modified.
- Affected code: `examples/comprehensive-vite/package.json`.
- `@runtime-env/vite-plugin`: Will be reviewed for any necessary adjustments to ensure a seamless testing workflow.
