# Design: Comprehensive Webpack Example

## Architecture Overview

The comprehensive webpack example follows the same architectural patterns as `comprehensive-vite`, but adapted to webpack's build system and ecosystem.

### Key Differences from Vite

| Aspect             | Vite (comprehensive-vite)        | Webpack (comprehensive-webpack) |
| ------------------ | -------------------------------- | ------------------------------- |
| **Build Tool**     | Vite 7.x                         | Webpack 5.x                     |
| **Dev Server**     | vite (built-in)                  | webpack-dev-server              |
| **HTML Plugin**    | Custom transformIndexHtml plugin | html-webpack-plugin             |
| **PWA Plugin**     | vite-plugin-pwa                  | workbox-webpack-plugin          |
| **TS Compilation** | esbuild (built-in)               | ts-loader                       |
| **Test Runner**    | Vitest                           | Jest                            |
| **HMR**            | Vite native HMR                  | webpack-dev-server HMR          |

## Development Mode Strategy

### Challenge: Serving Interpolated HTML

Unlike Vite's flexible `transformIndexHtml` hook, webpack requires a different approach:

**Option 1: webpack-dev-server static files**

- Write interpolated HTML to a temporary location
- Configure webpack-dev-server's `static` option to serve from that location
- Use `devServer.setupMiddlewares` to intercept index.html requests

**Option 2: html-webpack-plugin template**

- Use a custom template function in HtmlWebpackPlugin
- Read interpolated HTML from cache during webpack compilation
- May require custom plugin for dynamic template updates

**Recommended**: Option 1 - Simpler and more aligned with how Vite example works, keeping generated artifacts outside the build pipeline.

### Watch Mode Coordination

Development uses `concurrently` to run parallel processes:

1. `runtime-env --watch gen-ts` → `src/runtime-env.d.ts`
2. `runtime-env --watch gen-js` → `public/runtime-env.js`
3. `runtime-env --watch interpolate` → `node_modules/.cache/runtime-env/index.html`
4. `webpack serve` → Serves from cache location

## Build Mode Strategy

### Production Build

Build time:

- Only run `runtime-env gen-ts` for type checking
- Webpack compiles TypeScript and bundles assets
- HTML placeholders remain uninterpolated in build output

Container startup:

- `runtime-env gen-js` generates runtime-env.js from environment
- `runtime-env interpolate` processes index.html in-place
- `patch-runtime-env-revision` updates service worker revisions
- nginx serves the final interpolated assets

### Service Worker Generation

webpack's workbox-webpack-plugin:

```javascript
new GenerateSW({
  additionalManifestEntries: [
    { url: "/runtime-env.js", revision: "placeholder" },
  ],
  clientsClaim: true,
  skipWaiting: true,
});
```

The patch script (at container startup):

- Calculates MD5 hash of runtime-env.js
- Calculates MD5 hash of interpolated index.html
- Replaces placeholders in service-worker.js with actual hashes

## Testing Strategy

### Test Runner Decision

**Jest** (Traditional webpack ecosystem)

- Well-established in webpack projects with extensive ecosystem
- Native integration with TypeScript via ts-jest
- Familiar to webpack users
- Comprehensive mocking and assertion capabilities

This choice aligns with webpack ecosystem conventions and provides a complete testing solution that webpack users expect.

### Test Setup

Tests must load the generated `public/runtime-env.js`:

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./public/runtime-env.js"],
};
```

## Configuration Files

### webpack.config.js Structure

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "assets/[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: isDevelopment
          ? "node_modules/.cache/runtime-env/index.html"
          : "index.html",
      }),
      new GenerateSW({
        // PWA configuration
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      // Additional dev server config
    },
  };
};
```

### TypeScript Configuration

Single `tsconfig.json` (like comprehensive-vite):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "tests/**/*.ts"]
}
```

## Docker Strategy

Follow the same pattern as comprehensive-vite:

1. **Build stage**: Create SEA binaries for runtime-env CLI and patch script
2. **Runtime stage**: nginx serves built assets, start.sh orchestrates runtime generation

No differences from Vite approach - the Docker/nginx layer is build-tool agnostic.

## Parity Checklist

The webpack example MUST achieve feature parity with comprehensive-vite:

- ✓ Development mode with live reload on .env changes
- ✓ TypeScript type safety via generated declarations
- ✓ HTML interpolation with runtime environment
- ✓ Testing with runtime environment loaded
- ✓ Production builds (type-only generation at build time)
- ✓ Preview mode with all runtime generation steps
- ✓ Docker deployment with SEA binaries
- ✓ PWA support with service worker
- ✓ Cache busting for runtime-env.js and index.html
- ✓ Minimal, clean code examples
- ✓ Comprehensive documentation

## Trade-offs

### Complexity vs Familiarity

- **Webpack**: More configuration required, but familiar to many existing projects
- **Vite**: Simpler configuration, but this example targets webpack users

### Dev Server Integration

- Vite's plugin system makes serving interpolated HTML straightforward
- Webpack requires more manual setup but achieves the same result

### Build Speed

- Webpack will be slower than Vite in development
- This is acceptable as the example targets webpack users who already accept this trade-off
