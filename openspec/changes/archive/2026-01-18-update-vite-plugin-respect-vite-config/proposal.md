# Change: Respect Vite built-in configurations (envDir and envPrefix)

## Why

Vite provides standard configurations for managing environment variables, such as `envDir` for specifying the location of `.env` files and `envPrefix` for security by limiting which variables are exposed to the client. To provide an idiomatic and secure developer experience, `@runtime-env/vite-plugin` must respect these configurations.

The `runtime-env` CLI itself is generic and does not enforce Vite-specific security patterns like prefixes. Therefore, the Vite plugin should take responsibility for validating that the variables defined in the schema follow the project's configured `envPrefix`.

## What Changes

- **envDir Support**: Ensure that `.env` files are correctly resolved from the `envDir` specified in Vite config across all plugin modes (dev, preview, test).
- **envPrefix Validation**: Implement validation in the plugin to ensure all keys in `.runtimeenvschema.json` start with one of the prefixes defined in `envPrefix` (defaults to `VITE_`).
- **Error Reporting**: Provide clear, informative error messages and Vite HMR overlay feedback when prefix validation fails.
- **Breaking Change**: This enforces Vite's security model on `runtime-env` variables. Projects with non-prefixed variables in their schema will now need to either prefix them or adjust their `envPrefix` config.

## Impact

- Affected specs: `vite-plugin`
- Affected code: `packages/vite-plugin/src/utils.ts`, `dev.ts`, `preview.ts`, `vitest.ts`, `build.ts`
