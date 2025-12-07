# Tasks: Add comprehensive webpack example

## Setup and Structure

- [x] Create `examples/comprehensive-webpack` directory structure
- [x] Initialize package.json with webpack dependencies (webpack, webpack-cli, webpack-dev-server, html-webpack-plugin, workbox-webpack-plugin, ts-loader, typescript, jest, ts-jest, @types/jest)
- [x] Create `.runtimeenvschema.json` with FOO environment variable
- [x] Create `.gitignore` following comprehensive-vite pattern (ignoring generated files)
- [x] Create TypeScript configuration (tsconfig.json)

## Source Files

- [x] Create `index.html` template with `<%= runtimeEnv.FOO %>` placeholder
- [x] Create `src/index.ts` displaying runtime environment value and registering service worker
- [x] Create `public/` directory for static assets (vite.svg or equivalent)

## Webpack Configuration

- [x] Create `webpack.config.js` with:
  - TypeScript loader (ts-loader)
  - HtmlWebpackPlugin for HTML processing
  - GenerateSW from workbox-webpack-plugin with runtime-env.js placeholder
  - Development and production mode configurations
- [x] Configure webpack-dev-server for development mode

## Development Scripts

- [x] Add `dev:runtime-env:gen-ts` script for TypeScript declarations generation in watch mode
- [x] Add `dev:runtime-env:gen-js` script for runtime-env.js generation in watch mode
- [x] Add `dev:runtime-env:interpolate` script for HTML interpolation in watch mode to cache
- [x] Add `dev:webpack` script for webpack-dev-server
- [x] Add `dev` script using concurrently to run all dev scripts in parallel
- [x] Configure webpack-dev-server to serve interpolated HTML from cache

## Build Scripts

- [x] Add `build:runtime-env` script (gen-ts only for type checking)
- [x] Add `build:webpack` script (TypeScript compilation and webpack build)
- [x] Add `build` script combining runtime-env and webpack builds

## Preview Scripts

- [x] Add `preview:runtime-env:gen-js` script for generating runtime-env.js
- [x] Add `preview:runtime-env:interpolate` script with backup/restore for index.html
- [x] Add `preview:runtime-env:pwa` script with backup/restore for sw.js patching
- [x] Add `preview:webpack` script using webpack serve with static files
- [x] Add `preview` script combining all preview steps

## Testing

- [x] Create `tests/runtime-env.test.ts` with runtime and type checks
- [x] Add Jest configuration (jest.config.js with ts-jest preset and jsdom environment)
- [x] Add `test:runtime-env` script (gen-ts + gen-js)
- [x] Add `test:jest` script
- [x] Add `test` script combining runtime-env and test runner
- [x] Configure Jest setupFilesAfterEnv to load generated runtime-env.js

## PWA Support

- [x] Create `scripts/patch-runtime-env-revision.cjs` for service worker cache busting
- [x] Ensure script patches both runtime-env.js and index.html revisions in service-worker.js
- [x] Test patch script with built output

## Docker Deployment

- [x] Create multi-stage Dockerfile:
  - Build stage: npm ci, webpack build, SEA binary creation
  - Runtime stage: nginx with built assets
- [x] Create `start.sh` script (gen-js, interpolate, patch-runtime-env-revision, nginx)
- [x] Create `nginx.conf` with:
  - Cache-Control headers (no-cache for runtime files, long cache for hashed assets)
  - Content-Security-Policy headers
- [x] Test Docker build and run with environment variables

## Documentation

- [x] Create comprehensive README.md covering:
  - Project structure
  - Development workflow
  - Testing approach
  - Build process
  - Preview mode
  - Docker deployment
  - PWA/service worker functionality
  - Key differences from Vite approach
- [x] Document webpack-specific configurations and patterns
- [x] Add troubleshooting section

## Validation

- [x] Verify `npm run dev` works with live reloading
- [x] Verify `npm test` passes all tests
- [x] Verify `npm run build` produces optimized output
- [x] Verify `npm run preview` works correctly
- [x] Verify Docker build and runtime with various FOO values
- [x] Verify service worker caching and cache busting
- [x] Verify TypeScript types are generated and working
- [x] Compare functionality parity with comprehensive-vite
