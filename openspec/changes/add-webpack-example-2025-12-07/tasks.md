# Tasks: Add comprehensive webpack example

## Setup and Structure

- [ ] Create `examples/comprehensive-webpack` directory structure
- [ ] Initialize package.json with webpack dependencies (webpack, webpack-cli, webpack-dev-server, html-webpack-plugin, workbox-webpack-plugin, ts-loader, typescript, jest, ts-jest, @types/jest)
- [ ] Create `.runtimeenvschema.json` with FOO environment variable
- [ ] Create `.gitignore` following comprehensive-vite pattern (ignoring generated files)
- [ ] Create TypeScript configuration (tsconfig.json)

## Source Files

- [ ] Create `index.html` template with `<%= runtimeEnv.FOO %>` placeholder
- [ ] Create `src/index.ts` displaying runtime environment value and registering service worker
- [ ] Create `public/` directory for static assets (vite.svg or equivalent)

## Webpack Configuration

- [ ] Create `webpack.config.js` with:
  - TypeScript loader (ts-loader)
  - HtmlWebpackPlugin for HTML processing
  - GenerateSW from workbox-webpack-plugin with runtime-env.js placeholder
  - Development and production mode configurations
- [ ] Configure webpack-dev-server for development mode

## Development Scripts

- [ ] Add `dev:runtime-env:gen-ts` script for TypeScript declarations generation in watch mode
- [ ] Add `dev:runtime-env:gen-js` script for runtime-env.js generation in watch mode
- [ ] Add `dev:runtime-env:interpolate` script for HTML interpolation in watch mode to cache
- [ ] Add `dev:webpack` script for webpack-dev-server
- [ ] Add `dev` script using concurrently to run all dev scripts in parallel
- [ ] Configure webpack-dev-server to serve interpolated HTML from cache

## Build Scripts

- [ ] Add `build:runtime-env` script (gen-ts only for type checking)
- [ ] Add `build:webpack` script (TypeScript compilation and webpack build)
- [ ] Add `build` script combining runtime-env and webpack builds

## Preview Scripts

- [ ] Add `preview:runtime-env:gen-js` script for generating runtime-env.js
- [ ] Add `preview:runtime-env:interpolate` script with backup/restore for index.html
- [ ] Add `preview:runtime-env:pwa` script with backup/restore for sw.js patching
- [ ] Add `preview:webpack` script using webpack serve with static files
- [ ] Add `preview` script combining all preview steps

## Testing

- [ ] Create `tests/runtime-env.test.ts` with runtime and type checks
- [ ] Add Jest configuration (jest.config.js with ts-jest preset and jsdom environment)
- [ ] Add `test:runtime-env` script (gen-ts + gen-js)
- [ ] Add `test:jest` script
- [ ] Add `test` script combining runtime-env and test runner
- [ ] Configure Jest setupFilesAfterEnv to load generated runtime-env.js

## PWA Support

- [ ] Create `scripts/patch-runtime-env-revision.cjs` for service worker cache busting
- [ ] Ensure script patches both runtime-env.js and index.html revisions in service-worker.js
- [ ] Test patch script with built output

## Docker Deployment

- [ ] Create multi-stage Dockerfile:
  - Build stage: npm ci, webpack build, SEA binary creation
  - Runtime stage: nginx with built assets
- [ ] Create `start.sh` script (gen-js, interpolate, patch-runtime-env-revision, nginx)
- [ ] Create `nginx.conf` with:
  - Cache-Control headers (no-cache for runtime files, long cache for hashed assets)
  - Content-Security-Policy headers
- [ ] Test Docker build and run with environment variables

## Documentation

- [ ] Create comprehensive README.md covering:
  - Project structure
  - Development workflow
  - Testing approach
  - Build process
  - Preview mode
  - Docker deployment
  - PWA/service worker functionality
  - Key differences from Vite approach
- [ ] Document webpack-specific configurations and patterns
- [ ] Add troubleshooting section

## Validation

- [ ] Verify `npm run dev` works with live reloading
- [ ] Verify `npm test` passes all tests
- [ ] Verify `npm run build` produces optimized output
- [ ] Verify `npm run preview` works correctly
- [ ] Verify Docker build and runtime with various FOO values
- [ ] Verify service worker caching and cache busting
- [ ] Verify TypeScript types are generated and working
- [ ] Compare functionality parity with comprehensive-vite
