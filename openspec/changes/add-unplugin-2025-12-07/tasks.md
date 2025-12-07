# Tasks: Add @runtime-env/unplugin

## Package Setup

- [ ] Create `packages/unplugin` directory structure
- [ ] Initialize package.json with unplugin dependency (no chokidar needed)
- [ ] Setup TypeScript configuration (tsconfig.json)
- [ ] Add build scripts (esbuild or similar for bundling)
- [ ] Configure exports for Vite, Webpack, and generic adapters

## Core Implementation

- [ ] Create `src/types.ts` with `RuntimeEnvOptions` interface
- [ ] Create `src/generators.ts` with CLI wrapper functions:
  - startWatchProcesses(): spawn CLI with --watch flag for gen-ts and gen-js only
  - stopWatchProcesses(): cleanup watch processes
  - genTypes(): spawn gen-ts command once for build mode
  - interpolateHtml(): use CLI to interpolate HTML content inline (for Vite dev mode)
  - interpolateWithEscapedSyntax(): escape <%= to <%%= (for production builds)
  - loadEnvValues(): load env values as object (for Webpack/Rspack templateParameters)
- [ ] Implement default outputFile resolution for js option:
  - Vite: resolve from config.publicDir + '/runtime-env.js'
  - Webpack/Rspack: default to 'public/runtime-env.js'
  - Rollup: resolve from output.dir + '/runtime-env.js' or fallback to 'runtime-env.js'
  - esbuild: resolve from outdir + '/runtime-env.js' or outfile directory + '/runtime-env.js'
- [ ] Create `src/core.ts` with build tool-agnostic logic:
  - Option parsing and defaults
  - File path resolution
  - Development mode detection
  - Bundler detection utilities (validateInterpolateSupport, BUNDLERS_WITH_HTML_SUPPORT)
  - Centralized validation of interpolate support based on bundler

## Vite Integration

- [ ] Implement Vite-specific hooks in unplugin:
  - `configResolved`: Detect dev vs build mode, set default js.outputFile from config.publicDir
  - `transformIndexHtml` with enforce: 'pre':
    - Dev mode: call interpolateHtml() to inline transform HTML with runtime env values
    - Build mode: return HTML unchanged (template syntax preserved for server-side processing)
- [ ] Test Vite integration with comprehensive-vite example:
  - Verify HTML is transformed in dev with actual values
  - Verify HTML in dist contains unchanged <%= %> syntax (not escaped)
  - Verify HMR works when schema or env files change

## Webpack Integration

- [ ] Implement `webpack()` specific hook in unplugin:
  - Detect production vs development mode
  - Set default js.outputFile to 'public/runtime-env.js' if not provided
  - Hook into HtmlWebpackPlugin.getHooks(compilation)
  - Throw error if html-webpack-plugin not found when interpolate is used
- [ ] Handle HtmlWebpackPlugin integration:
  - Dev mode: use `beforeTemplateExecution` hook to inject templateParameters with loadEnvValues()
  - Production mode: HTML passes through unchanged (no hook needed)
- [ ] Test Webpack integration with comprehensive-webpack example:
  - Verify HTML is transformed in dev with actual values
  - Verify HTML in dist contains unchanged <%= %> syntax (not escaped)
  - Verify HMR works when schema or env files change

## Rspack Integration

- [ ] Implement `rspack()` specific hook in unplugin:
  - Similar logic to Webpack adapter (html-rspack-plugin has compatible API)
  - Set default js.outputFile to 'public/runtime-env.js' if not provided
  - Hook into html-rspack-plugin lifecycle
  - Throw error if html-rspack-plugin not found when interpolate is used
- [ ] Handle html-rspack-plugin integration:
  - Dev mode: use `beforeTemplateExecution` hook to inject templateParameters
  - Production mode: HTML passes through unchanged (no hook needed)
- [ ] Test Rspack integration if possible

## Rollup Integration

- [ ] Implement `rollup` specific hook in unplugin:
  - Use `options()` hook to access rollup configuration
  - Set default js.outputFile based on output.dir (fallback to 'runtime-env.js')
  - No HTML support (validation handled by bundler detection)
- [ ] Test that validation correctly prevents interpolate usage

## esbuild Integration

- [ ] Implement `esbuild` specific hook in unplugin:
  - Use `setup()` hook to access esbuild build options
  - Set default js.outputFile based on outdir or outfile directory
  - Fallback to 'runtime-env.js' if neither specified
  - No HTML support (validation handled by bundler detection)
- [ ] Test that validation correctly prevents interpolate usage

## Bundler Detection and Validation

- [ ] Implement centralized bundler detection in core.ts
- [ ] Maintain BUNDLERS_WITH_HTML_SUPPORT array (vite, webpack, rspack)
- [ ] Validation throws error at plugin init with list of supported bundlers
- [ ] Document bundler support in README
- [ ] Document how to add new bundler support (update array)

## Main Entry Point

- [ ] Create `src/index.ts` with unplugin factory using createUnplugin
- [ ] Access bundler name via meta.framework from unplugin
- [ ] Call validateInterpolateSupport() at plugin initialization (fail fast)
- [ ] Implement unified hooks (buildStart, buildEnd)
- [ ] Implement bundler-specific hooks (vite, webpack, rspack)
- [ ] Export Vite plugin
- [ ] Export Webpack plugin
- [ ] Export Rspack plugin
- [ ] Export Rollup plugin
- [ ] Export esbuild plugin
- [ ] Export types for TypeScript users

## Documentation

- [ ] Create README.md with:
  - Installation instructions
  - Usage examples for Vite and Webpack
  - Configuration options reference
  - Migration guide from script-based approach
  - Troubleshooting section
- [ ] Add JSDoc comments to all public APIs
- [ ] Create examples directory with minimal setups

## Testing

- [ ] Unit tests for generators (mock spawn)
- [ ] Unit tests for option parsing
- [ ] Unit tests for path resolution
- [ ] Integration test with Vite project:
  - Verify types are generated
  - Verify runtime-env.js is generated
  - Verify HTML is interpolated in dev
  - Verify placeholders preserved in build
- [ ] Integration test with Webpack project:
  - Same verifications as Vite
- [ ] E2E test running actual dev server and verifying served content

## Example Updates

- [ ] Update `examples/comprehensive-vite`:
  - Remove `concurrently` dependency
  - Remove all `dev:runtime-env:*` scripts
  - Remove `build:runtime-env` script
  - Simplify `dev` script to just `vite`
  - Simplify `build` script to just `tsc && vite build`
  - Add `@runtime-env/unplugin` dependency
  - Update vite.config.ts to use plugin with required `interpolate: { envFile: ['.env'] }`
  - Update README.md with new approach
  - Verify all workflows still work
- [ ] Update `examples/comprehensive-webpack`:
  - Remove `concurrently` dependency
  - Remove all `dev:runtime-env:*` scripts
  - Remove `build:runtime-env` script
  - Simplify `dev` script to just `webpack serve --mode development`
  - Simplify `build` script to just `webpack --mode production`
  - Add `@runtime-env/unplugin` dependency
  - Update webpack.config.js to use plugin with required `interpolate: { inputFile: 'index.html' }`
  - Update README.md with new approach
  - Verify all workflows still work

## Build and Publish

- [ ] Build the package (bundle for distribution)
- [ ] Test built package with both examples
- [ ] Update root package.json workspace configuration
- [ ] Add unplugin to workspace
- [ ] Update root README.md mentioning the unplugin
- [ ] Prepare CHANGELOG.md

## Validation

- [ ] Verify development mode works:
  - Types auto-generate on schema change
  - Runtime-env.js auto-generates on env change
  - HTML auto-interpolates on template or env change
  - HMR/reload triggers appropriately
- [ ] Verify build mode works:
  - Types generated once
  - Runtime-env.js not included in build
  - HTML placeholders preserved
- [ ] Verify test mode works:
  - Types exist for type checking
  - Runtime-env.js exists for test loading
- [ ] Verify Docker deployment unchanged:
  - Build output is correct
  - Runtime interpolation still works
  - PWA patch script still works
- [ ] Compare bundle sizes (before/after examples)
- [ ] Check for any regressions

## Documentation Updates

- [ ] Update main project README.md:
  - Add unplugin to quick start
  - Show simplified script examples
  - Link to unplugin package README
- [ ] Update migration guide for existing users
- [ ] Add "Why unplugin?" section explaining benefits
