# Spec: Unplugin Integration

## ADDED Requirements

### Requirement: The unplugin MUST provide automatic runtime-env file generation during development

The plugin automatically generates and watches runtime-env files in development mode without requiring manual npm scripts.

#### Scenario: TypeScript declarations are auto-generated on schema changes

**GIVEN** a project with `.runtimeenvschema.json`
**AND** the unplugin is configured
**WHEN** the developer runs the dev server
**THEN** `src/runtime-env.d.ts` SHALL be generated automatically
**AND** the file SHALL regenerate when `.runtimeenvschema.json` changes
**AND** the type definitions SHALL match the schema structure

#### Scenario: Runtime JavaScript is auto-generated on environment changes

**GIVEN** a project with `.runtimeenvschema.json` and `.env` file
**AND** the unplugin is configured
**WHEN** the developer runs the dev server
**THEN** `public/runtime-env.js` SHALL be generated automatically
**AND** the file SHALL regenerate when `.env` or `.runtimeenvschema.json` changes
**AND** the JavaScript SHALL expose environment variables via `globalThis.runtimeEnv`

#### Scenario: HTML interpolation is handled directly by build tool hooks

**GIVEN** a project with `index.html` containing `<%= runtimeEnv.FOO %>` placeholders
**AND** the unplugin is configured with `interpolate` option
**WHEN** the developer runs the dev server
**THEN** HTML interpolation SHALL be performed inline by the build tool hook
**AND** NO separate watch process for interpolation SHALL be spawned
**AND** HTML transformation SHALL happen during the build tool's HTML processing phase

### Requirement: The unplugin MUST serve interpolated HTML in development mode

The plugin uses build tool hooks to transform HTML with runtime environment values during development.

#### Scenario: Vite transforms HTML inline with runtime values

**GIVEN** a Vite project with the unplugin configured
**AND** `index.html` contains `<%= runtimeEnv.FOO %>` placeholders
**WHEN** the developer runs `vite` in development mode
**THEN** Vite's `transformIndexHtml` hook SHALL interpolate the HTML inline
**AND** the browser SHALL receive HTML with environment values already replaced
**AND** changes to schema or env files SHALL trigger HMR reload

#### Scenario: Webpack injects templateParameters with runtime values

**GIVEN** a Webpack project with html-webpack-plugin configured
**AND** `index.html` contains `<%= runtimeEnv.FOO %>` placeholders
**WHEN** the developer runs `webpack serve --mode development`
**THEN** the plugin SHALL hook into `beforeTemplateExecution`
**AND** templateParameters SHALL be injected with runtime environment values
**AND** HtmlWebpackPlugin SHALL process the template with injected values
**AND** the browser SHALL receive HTML with environment values already replaced

#### Scenario: Rspack injects templateParameters with runtime values

**GIVEN** a Rspack project with html-rspack-plugin configured
**AND** `index.html` contains `<%= runtimeEnv.FOO %>` placeholders
**WHEN** the developer runs rspack serve in development mode
**THEN** the plugin SHALL hook into `beforeTemplateExecution`
**AND** templateParameters SHALL be injected with runtime environment values
**AND** the browser SHALL receive HTML with environment values already replaced

### Requirement: The unplugin MUST preserve runtime-env placeholders in production builds

The plugin escapes template syntax in production to prevent evaluation at build time.

#### Scenario: Vite build escapes template syntax

**GIVEN** a Vite project with `index.html` containing `<%= runtimeEnv.FOO %>`
**AND** the unplugin is configured
**WHEN** the developer runs `vite build`
**THEN** the `transformIndexHtml` hook SHALL escape `<%=` to `<%%=`
**AND** `dist/index.html` SHALL contain `<%= runtimeEnv.FOO %>` (preserved for runtime)
**AND** the placeholder syntax SHALL NOT be evaluated at build time
**AND** the HTML SHALL be ready for runtime interpolation

#### Scenario: Webpack build escapes template syntax

**GIVEN** a Webpack project with `index.html` containing `<%= runtimeEnv.FOO %>`
**AND** the unplugin is configured with html-webpack-plugin
**WHEN** the developer runs `webpack --mode production`
**THEN** the `beforeEmit` hook SHALL escape `<%=` to `<%%=`
**AND** `dist/index.html` SHALL contain `<%= runtimeEnv.FOO %>` (preserved for runtime)
**AND** HtmlWebpackPlugin SHALL NOT process the lodash template syntax
**AND** the HTML SHALL be ready for runtime interpolation

#### Scenario: Rspack build escapes template syntax

**GIVEN** a Rspack project with `index.html` containing `<%= runtimeEnv.FOO %>`
**AND** the unplugin is configured with html-rspack-plugin
**WHEN** the developer runs rspack build in production mode
**THEN** the `beforeEmit` hook SHALL escape `<%=` to `<%%=`
**AND** `dist/index.html` SHALL contain `<%= runtimeEnv.FOO %>` (preserved for runtime)
**AND** the HTML SHALL be ready for runtime interpolation

### Requirement: The unplugin MUST detect bundler and validate HTML interpolation support

The plugin uses unplugin's meta.framework to detect the bundler and validates interpolate support centrally at initialization, preventing misconfiguration early.

#### Scenario: Unsupported bundler throws error at plugin initialization

**GIVEN** a Rollup or esbuild project with the unplugin configured
**AND** the `interpolate` option is provided
**WHEN** the plugin factory executes (before any hooks run)
**THEN** validateInterpolateSupport() SHALL be called with meta.framework
**AND** an error SHALL be thrown immediately
**AND** the error message SHALL state which bundler was detected
**AND** the error message SHALL list all supported bundlers (vite, webpack, rspack)
**AND** the error message SHALL suggest removing interpolate or switching bundlers
**AND** the build SHALL fail before any compilation starts

#### Scenario: Future bundler support can be added by updating array

**GIVEN** a new bundler (e.g., Farm, Rolldown) gains HTML plugin support
**WHEN** a developer wants to add support
**THEN** they SHALL only need to add the bundler name to BUNDLERS_WITH_HTML_SUPPORT array
**AND** implement the bundler-specific hook for HTML transformation
**AND** no changes to validation logic SHALL be required

### Requirement: The unplugin MUST handle production build preparation

The plugin generates necessary files once during production builds and cleans up development artifacts.

#### Scenario: TypeScript declarations generated before production build

**GIVEN** a project configured with the unplugin
**WHEN** the developer runs a production build
**THEN** `src/runtime-env.d.ts` SHALL be generated before build starts
**AND** the file SHALL be available for TypeScript compilation
**AND** the generation SHALL happen only once (not in watch mode)

#### Scenario: Development artifacts cleaned before production build

**GIVEN** a project with `public/runtime-env.js` from development
**AND** the unplugin is configured
**WHEN** the developer runs a production build
**THEN** `public/runtime-env.js` SHALL be removed before build
**AND** the file SHALL NOT be included in the production bundle
**AND** the dist output SHALL only contain static assets (no runtime-env.js)

### Requirement: The unplugin MUST automatically detect HTML from bundler configuration

The plugin uses each bundler's native HTML handling without requiring explicit inputFile.

#### Scenario: Vite automatically processes index.html

**GIVEN** a Vite project with `index.html` in project root
**AND** the unplugin is configured with `interpolate: {}`
**WHEN** the dev server or build runs
**THEN** the plugin SHALL use transformIndexHtml hook
**AND** NO inputFile SHALL be required
**AND** Vite's standard index.html resolution SHALL be used

#### Scenario: Webpack uses HtmlWebpackPlugin's template

**GIVEN** a Webpack project with html-webpack-plugin configured
**AND** the unplugin is configured with `interpolate: {}`
**WHEN** the build runs
**THEN** the plugin SHALL hook into HtmlWebpackPlugin
**AND** NO inputFile SHALL be required
**AND** the template configured in HtmlWebpackPlugin SHALL be used

#### Scenario: Webpack throws error when html-webpack-plugin missing

**GIVEN** a Webpack project without html-webpack-plugin
**AND** the unplugin is configured with `interpolate` option
**WHEN** the plugin initializes
**THEN** an error SHALL be thrown
**AND** the error SHALL explain html-webpack-plugin is required
**AND** the build SHALL fail

#### Scenario: Rspack throws error when html-rspack-plugin missing

**GIVEN** a Rspack project without html-rspack-plugin
**AND** the unplugin is configured with `interpolate` option
**WHEN** the plugin initializes
**THEN** an error SHALL be thrown
**AND** the error SHALL explain html-rspack-plugin is required
**AND** the build SHALL fail

### Requirement: The unplugin MUST provide minimal configuration with sensible defaults

The plugin provides smart defaults based on bundler configuration.

#### Scenario: Default js outputFile uses Vite's publicDir

**GIVEN** a Vite project with publicDir set to 'public' (or default)
**AND** the unplugin is configured with `js: {}`
**WHEN** the plugin initializes
**THEN** js.outputFile SHALL default to `public/runtime-env.js`
**AND** the file SHALL be treated as a static asset

#### Scenario: Default js outputFile for Webpack/Rspack

**GIVEN** a Webpack or Rspack project
**AND** the unplugin is configured with `js: {}`
**WHEN** the plugin initializes
**THEN** js.outputFile SHALL default to `public/runtime-env.js`

#### Scenario: Default js outputFile for Rollup

**GIVEN** a Rollup project with `output.dir` set to 'dist'
**AND** the unplugin is configured with `js: {}`
**WHEN** the plugin initializes
**THEN** js.outputFile SHALL default to `dist/runtime-env.js`
**AND** **IF** output.dir is not set
**THEN** js.outputFile SHALL default to `runtime-env.js`

#### Scenario: Default js outputFile for esbuild

**GIVEN** an esbuild project with `outdir` set to 'dist'
**AND** the unplugin is configured with `js: {}`
**WHEN** the plugin initializes
**THEN** js.outputFile SHALL default to `dist/runtime-env.js`
**AND** **IF** outdir is not set but outfile is 'build/bundle.js'
**THEN** js.outputFile SHALL default to `build/runtime-env.js`
**AND** **IF** neither outdir nor outfile is set
**THEN** js.outputFile SHALL default to `runtime-env.js`

#### Scenario: Plugin works with minimal configuration

**GIVEN** a project with standard structure:

- `.runtimeenvschema.json` in project root
- `index.html` in project root
- `src/` directory for source code
- `public/` directory for static assets
  **WHEN** the developer adds the plugin with minimal config:

```typescript
runtimeEnv({
  ts: { outputFile: "src/runtime-env.d.ts" },
  js: {}, // uses default publicDir/runtime-env.js
  interpolate: {}, // no inputFile needed
});
```

**THEN** the plugin SHALL automatically:

- Generate types to specified path
- Generate JavaScript to default path based on bundler
- Transform HTML using bundler's HTML handling
- Read environment from process.env (default: empty `envFile` array)
- Use schema from `.runtimeenvschema.json` (default: `schemaFile`)
- Use global variable name `runtimeEnv` (default: `globalVariableName`)

#### Scenario: Plugin allows custom path configuration

**GIVEN** a project with non-standard paths
**WHEN** the developer configures the plugin with custom options:

```typescript
runtimeEnv({
  schemaFile: "config/env-schema.json",
  ts: {
    outputFile: "types/env.d.ts",
  },
  js: {
    outputFile: "assets/env.js",
    envFile: [".env.local", ".env"],
  },
  interpolate: {
    envFile: [".env.local", ".env"],
  },
});
```

**THEN** the plugin SHALL use the specified paths
**AND** all file generation SHALL respect the custom configuration
**AND** TypeScript SHALL report errors for invalid option types

### Requirement: The unplugin MUST simplify project scripts to standard build tool commands

Users can replace multiple npm scripts with single build tool commands.

#### Scenario: Vite development requires no custom scripts

**GIVEN** a Vite project with the unplugin
**WHEN** the developer defines scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}
```

**THEN** `npm run dev` SHALL start development with all runtime-env automation
**AND** `npm run build` SHALL create production build with placeholders preserved
**AND** no `concurrently`, `runtime-env`, or custom scripts SHALL be required

#### Scenario: Webpack development requires no custom scripts

**GIVEN** a Webpack project with the unplugin
**WHEN** the developer defines scripts:

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

**THEN** `npm run dev` SHALL start development with all runtime-env automation
**AND** `npm run build` SHALL create production build with placeholders preserved
**AND** no `concurrently`, `runtime-env`, or custom scripts SHALL be required

### Requirement: The unplugin MUST integrate with build tool hot reload mechanisms

Changes to runtime-env files trigger appropriate browser updates.

#### Scenario: Changes to generated files trigger reload

**GIVEN** a development server running with the unplugin
**WHEN** the `.env` file changes
**THEN** `public/runtime-env.js` SHALL regenerate
**AND** the cached `index.html` SHALL regenerate (if it uses env values)
**AND** the browser SHALL reload to reflect changes
**AND** the page SHALL display updated environment values

#### Scenario: Changes to schema trigger type regeneration

**GIVEN** a development server running with the unplugin
**WHEN** `.runtimeenvschema.json` is modified
**THEN** `src/runtime-env.d.ts` SHALL regenerate
**AND** TypeScript SHALL recompile with new types
**AND** type errors SHALL appear if code doesn't match new schema

### Requirement: The unplugin MUST support multiple build tools via unplugin framework

The same plugin code adapts to different build tools automatically.

#### Scenario: Plugin works with Vite

**GIVEN** a Vite project
**WHEN** the developer imports `@runtime-env/unplugin/vite`
**AND** adds it to Vite plugins array
**THEN** the plugin SHALL integrate with Vite's plugin API
**AND** all runtime-env features SHALL work correctly
**AND** HTML interpolation SHALL work via transformIndexHtml hook

#### Scenario: Plugin works with Webpack

**GIVEN** a Webpack project with html-webpack-plugin
**WHEN** the developer imports `@runtime-env/unplugin/webpack`
**AND** adds it to Webpack plugins array
**THEN** the plugin SHALL integrate with Webpack's plugin API
**AND** all runtime-env features SHALL work correctly
**AND** HTML interpolation SHALL work via HtmlWebpackPlugin hooks

#### Scenario: Plugin works with Rspack

**GIVEN** a Rspack project with html-rspack-plugin
**WHEN** the developer imports `@runtime-env/unplugin/rspack`
**AND** adds it to Rspack plugins array
**THEN** the plugin SHALL integrate with Rspack's plugin API
**AND** all runtime-env features SHALL work correctly
**AND** HTML interpolation SHALL work via html-rspack-plugin hooks

#### Scenario: Plugin works with Rollup but without HTML interpolation

**GIVEN** a Rollup project
**WHEN** the developer imports `@runtime-env/unplugin/rollup`
**AND** adds it to Rollup plugins array
**AND** does NOT provide interpolate option
**THEN** the plugin SHALL integrate with Rollup's plugin API
**AND** TypeScript and JavaScript generation SHALL work correctly

#### Scenario: Plugin works with esbuild but without HTML interpolation

**GIVEN** an esbuild project
**WHEN** the developer imports `@runtime-env/unplugin/esbuild`
**AND** adds it to esbuild plugins array
**AND** does NOT provide interpolate option
**THEN** the plugin SHALL integrate with esbuild's plugin API
**AND** TypeScript and JavaScript generation SHALL work correctly

## MODIFIED Requirements

None. This is a new capability that doesn't modify existing requirements.

## REMOVED Requirements

None. The CLI package remains unchanged and all existing workflows continue to work.
