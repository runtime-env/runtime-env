# @runtime-env/unplugin

Automatic runtime-env integration for Vite, Webpack, Rollup, esbuild, and Rspack using [unplugin](https://github.com/unjs/unplugin).

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🔄 **Automatic File Generation** - TypeScript types and JavaScript runtime files generated automatically
- 🔥 **Hot Module Replacement** - Changes to schema or env files trigger instant updates
- 🎯 **HTML Interpolation** - Runtime environment values interpolated inline in development
- 📦 **Multi-Bundler Support** - Works with Vite, Webpack, Rspack, Rollup, and esbuild
- 🛠️ **Build Tool Native** - Uses each bundler's native HTML handling capabilities

## Installation

```bash
npm install @runtime-env/unplugin @runtime-env/cli
```

Both packages are required:
- `@runtime-env/unplugin` - The unplugin integration
- `@runtime-env/cli` - The CLI tool (peer dependency)

## Usage

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import runtimeEnv from '@runtime-env/unplugin/vite';

export default defineConfig({
  plugins: [
    runtimeEnv({
      ts: { outputFile: 'src/runtime-env.d.ts' },
      js: { envFile: ['.env'] },
      interpolate: { envFile: ['.env'] },
    }),
  ],
});
```

Then simplify your scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}
```

### Webpack

```js
// webpack.config.js
const runtimeEnv = require('@runtime-env/unplugin/webpack');

module.exports = {
  plugins: [
    runtimeEnv({
      ts: { outputFile: 'src/runtime-env.d.ts' },
      js: { envFile: ['.env'] },
      interpolate: { envFile: ['.env'] },
    }),
  ],
};
```

Then simplify your scripts:

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

### Rspack

```js
// rspack.config.js
const runtimeEnv = require('@runtime-env/unplugin/rspack');

module.exports = {
  plugins: [
    runtimeEnv({
      ts: { outputFile: 'src/runtime-env.d.ts' },
      js: { envFile: ['.env'] },
      interpolate: { envFile: ['.env'] },
    }),
  ],
};
```

### Rollup

```js
// rollup.config.js
import runtimeEnv from '@runtime-env/unplugin/rollup';

export default {
  plugins: [
    runtimeEnv({
      ts: { outputFile: 'src/runtime-env.d.ts' },
      js: { envFile: ['.env'] },
      // Note: HTML interpolation not supported in Rollup
    }),
  ],
};
```

### esbuild

```js
// build.js
const runtimeEnv = require('@runtime-env/unplugin/esbuild');
const esbuild = require('esbuild');

esbuild.build({
  plugins: [
    runtimeEnv({
      ts: { outputFile: 'src/runtime-env.d.ts' },
      js: { envFile: ['.env'] },
      // Note: HTML interpolation not supported in esbuild
    }),
  ],
});
```

## Configuration

### RuntimeEnvOptions

```ts
interface RuntimeEnvOptions {
  // Path to JSON schema file (default: '.runtimeenvschema.json')
  schemaFile?: string;

  // Global variable name (default: 'runtimeEnv')
  globalVariableName?: string;

  // TypeScript generation options
  ts?: {
    outputFile: string; // REQUIRED
  };

  // JavaScript generation options
  js?: {
    outputFile?: string; // Auto-detected based on bundler
    envFile?: string | string[]; // Default: [] (uses process.env)
  };

  // HTML interpolation options
  interpolate?: {
    envFile?: string | string[]; // Default: [] (uses process.env)
  };
}
```

### Default Paths

The plugin automatically determines sensible defaults for `js.outputFile` based on your bundler:

- **Vite**: `{publicDir}/runtime-env.js` (usually `public/runtime-env.js`)
- **Webpack/Rspack**: `public/runtime-env.js`
- **Rollup**: `{output.dir}/runtime-env.js` or `runtime-env.js`
- **esbuild**: `{outdir}/runtime-env.js` or `runtime-env.js`

### HTML Interpolation

HTML interpolation is supported in:
- ✅ Vite (via `transformIndexHtml` hook)
- ✅ Webpack (via `html-webpack-plugin`)
- ✅ Rspack (via `html-rspack-plugin`)

Not supported in:
- ❌ Rollup (no built-in HTML handling)
- ❌ esbuild (no built-in HTML handling)

For Webpack and Rspack, you must have the corresponding HTML plugin installed.

## How It Works

### Development Mode

1. **TypeScript & JavaScript Generation**: The plugin spawns CLI watch processes that automatically regenerate files when schema or env files change
2. **HTML Interpolation**: Build tool hooks transform HTML inline with runtime environment values
3. **Hot Reload**: Changes trigger appropriate browser updates via HMR

### Production Build

1. **TypeScript Generation**: Types generated once for type checking
2. **JavaScript Cleanup**: Removes development `runtime-env.js` file
3. **HTML Preservation**: Template syntax (`<%= runtimeEnv.FOO %>`) passes through unchanged for server-side processing

## Migration from Script-Based Approach

**Before:**

```json
{
  "scripts": {
    "dev": "concurrently --kill-others-on-fail \"npm:dev:*\"",
    "dev:runtime-env:gen-ts": "runtime-env --watch gen-ts --output-file src/runtime-env.d.ts",
    "dev:runtime-env:gen-js": "runtime-env --watch gen-js --env-file .env --output-file public/runtime-env.js",
    "dev:runtime-env:interpolate": "mkdir -p node_modules/.cache/runtime-env && runtime-env --watch interpolate --env-file .env --input-file index.html --output-file node_modules/.cache/runtime-env/index.html",
    "dev:vite": "vite"
  },
  "devDependencies": {
    "concurrently": "^9.2.1"
  }
}
```

**After:**

```json
{
  "scripts": {
    "dev": "vite"
  }
}
```

No more `concurrently`, no custom scripts - just the standard build tool command!

## Troubleshooting

### HTML Plugin Not Found

If you see an error about missing `html-webpack-plugin` or `html-rspack-plugin`:

1. Install the required plugin: `npm install html-webpack-plugin` or `npm install html-rspack-plugin`
2. Or remove the `interpolate` option from your configuration

### Unsupported Bundler for HTML Interpolation

If you see an error about HTML interpolation not being supported:

1. HTML interpolation only works with Vite, Webpack, and Rspack
2. Remove the `interpolate` option for Rollup and esbuild
3. Or switch to a supported bundler

### Environment Variables Not Loading

The plugin does NOT automatically load `.env` files. You must explicitly specify them:

```ts
runtimeEnv({
  js: { envFile: ['.env'] },
  interpolate: { envFile: ['.env'] },
})
```

## License

MIT
