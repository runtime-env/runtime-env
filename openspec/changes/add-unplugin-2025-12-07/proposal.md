# Proposal: Add @runtime-env/unplugin for simplified integration

## Why

Currently, users must manually configure multiple scripts for runtime-env in their projects:

- Development: `dev:runtime-env:gen-ts`, `dev:runtime-env:gen-js`, `dev:runtime-env:interpolate` + `concurrently`
- Build: `build:runtime-env` with separate gen-ts command
- Test: `test:runtime-env` with gen-ts and gen-js commands
- Preview: Multiple `preview:runtime-env:*` scripts for gen-js, interpolation, and PWA patching

This creates significant boilerplate across both Vite and Webpack examples:

1. 10+ npm scripts per example
2. `concurrently` dependency for parallel execution
3. Manual cache directory management (`mkdir -p node_modules/.cache/runtime-env`)
4. Manual cleanup of generated files (`rm -f public/runtime-env.js`)
5. Manual file watching coordination
6. Build tool-specific HTML template configuration (HtmlWebpackPlugin, Vite HTML transform)

An unplugin would:

- Reduce configuration to a single plugin import
- Eliminate need for custom npm scripts beyond standard build tool commands
- Handle file generation, watching, and cleanup automatically
- Provide consistent API across Vite, Webpack, Rollup, esbuild, and Rspack
- Remove `concurrently` dependency
- Simplify user adoption and maintenance

## What Changes

Create a new `@runtime-env/unplugin` package that provides automatic runtime-env integration for multiple build tools through the unplugin framework.

The unplugin MUST:

### Core Functionality

- Auto-generate TypeScript declarations (`gen-ts`) in watch mode during development
- Auto-generate runtime-env.js (`gen-js`) in watch mode during development
- Transform HTML inline using build tool hooks (NO separate interpolate watch process)
  - **Vite**: Use `transformIndexHtml` hook to inline interpolate HTML
  - **Webpack**: Use `HtmlWebpackPlugin.beforeTemplateExecution` to inject templateParameters
  - **Rspack**: Use `html-rspack-plugin.beforeTemplateExecution` to inject templateParameters
- Generate TypeScript declarations once during production build
- Escape template syntax in production HTML (transform `<%=` to `<%%=` to preserve placeholders)
- Clean up generated files before production builds
- Support custom schema file paths and output locations
- Respect `.env` files automatically

### Build Tool Integration

- Integrate with Vite's plugin system
- Integrate with Webpack via unplugin adapter
- Support other unplugin-compatible tools (Rollup, esbuild, Rspack)
- Hook into appropriate build lifecycle events for each tool
- Handle HMR/live reload triggers when runtime-env files change

### Developer Experience

- Provide TypeScript types for plugin options with JSDoc documentation
- Organize options into nested objects by concern: `ts`, `js`, `interpolate`
- Presence of `ts`, `js`, or `interpolate` options determines which features are enabled
- Default values:
  - `schemaFile`: `.runtimeenvschema.json`
  - `globalVariableName`: `runtimeEnv`
  - `envFile` within `js` and `interpolate`: `[]` (empty, uses process.env like CLI default)
  - `js.outputFile`: Bundler-aware defaults
    - Vite: `{publicDir}/runtime-env.js`
    - Webpack/Rspack: `public/runtime-env.js`
    - Rollup: `{output.dir}/runtime-env.js` or `runtime-env.js`
    - esbuild: `{outdir}/runtime-env.js` or `runtime-env.js`
  - `ts.outputFile`: REQUIRED (no default, must be specified)
- HTML interpolation automatically uses bundler's HTML handling:
  - No `inputFile` needed (uses bundler's configured HTML template)
  - Vite: `transformIndexHtml` hook processes index.html automatically
  - Webpack/Rspack: Uses html-webpack-plugin/html-rspack-plugin's configured template
- Throw errors (not warnings) for unsupported bundler + interpolate combinations
- Clear error messages for misconfiguration

## Scope

This change creates a new package `@runtime-env/unplugin` alongside the existing `@runtime-env/cli` package.

IN SCOPE:

- Create `packages/unplugin` directory with unplugin implementation
- Development mode automation (gen-ts and gen-js in watch mode)
- HTML interpolation via build tool hooks (NO separate watch process):
  - Vite: inline transform via `transformIndexHtml`
  - Webpack: inject templateParameters via `HtmlWebpackPlugin` hooks
  - Rspack: inject templateParameters via `html-rspack-plugin` hooks
- Build mode automation (gen-ts only, escape HTML syntax to preserve <%= %>)
- Integration with Vite (transformIndexHtml), Webpack (html-webpack-plugin), Rspack (html-rspack-plugin)
- TypeScript types and documentation
- Update comprehensive-vite and comprehensive-webpack examples to use the unplugin
- Demonstrate simplified scripts (just `vite` or `webpack serve --mode development`)
- Centralized bundler detection: validate HTML interpolation support at plugin initialization
- Easy to extend: add new bundler support by updating supported bundlers array

OUT OF SCOPE:

- Preview/deployment workflow automation (gen-js, interpolate, PWA patching at runtime)
- Docker configuration changes
- Production build HTML transformation (template syntax passes through unchanged for server-side processing)
- Test runner integration beyond plugin reusability (if test runner reuses plugins like Vitest, it works automatically; otherwise manual test scripts remain)
- Changes to @runtime-env/cli package
- New CLI commands or options
- HTML interpolation support for Rollup, esbuild, Rolldown (no built-in HTML handling)
- Custom HTML plugin implementations for bundlers without native support
- Automatic .env file loading (must be explicitly specified in envFile option)

## Dependencies

- `@runtime-env/cli` as peer dependency (users must install both packages)
  - Plugin executes CLI commands for gen-ts, gen-js, and interpolate
  - Users likely already have CLI installed for production (Docker containers)
- Uses `unplugin` framework for cross-tool compatibility
- Must work with Vite 5+, Webpack 5+
- Examples should demonstrate before/after script simplification

## Success Criteria

After implementation:

- Users can add one plugin import instead of 10+ npm scripts
- Development script becomes just `vite` or `webpack serve --mode development`
- Build script becomes just `vite build` or `webpack --mode production`
- All runtime-env file generation happens automatically
- HTML interpolation works seamlessly in development
- Production builds preserve runtime-env placeholders correctly
- comprehensive-vite and comprehensive-webpack examples are simplified
- No loss of functionality compared to current script-based approach
