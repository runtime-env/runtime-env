# Comprehensive Webpack Example

This example demonstrates all features of `@runtime-env/cli` in a **Webpack** environment, including development, testing, building, preview, and Docker deployment workflows.

## Overview

This example showcases:

- **Development mode** with hot reloading and watch mode for runtime environment
- **TypeScript** support with type-safe runtime environment access
- **Testing** with Jest loading runtime environment
- **Production builds** with optimized bundles
- **Preview mode** with complete runtime environment generation pipeline

- **Docker deployment** with Single Executable Application (SEA) binaries

## Features

- ✅ Runtime environment variables via `globalThis.runtimeEnv`
- ✅ TypeScript types generated from JSON schema
- ✅ HTML interpolation with `<%= runtimeEnv.FOO %>` syntax

- ✅ Jest tests with runtime environment loaded
- ✅ Docker deployment with nginx and SEA binaries
- ✅ Development, build, preview, and test workflows

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Docker (for Docker deployment)

## Installation

```bash
npm install
```

## Available Scripts

### Development

Start development server with hot reloading on `http://localhost:8080`:

```bash
npm run dev
```

This runs four concurrent processes:

1. `gen-ts --watch` - Generates TypeScript types
2. `gen-js --watch` - Generates runtime-env.js
3. `interpolate --watch` - Interpolates index.html to cache
4. `webpack serve` - Starts webpack dev server

### Build

Build for production:

```bash
npm run build
```

This generates TypeScript types once and builds with webpack in production mode.

### Preview

Preview production build locally:

```bash
npm run preview
```

This generates runtime-env.js, interpolates index.html, and serves static files.

### Test

Run Jest tests:

```bash
npm run test
```

This generates TypeScript types and runtime-env.js, then runs Jest with jsdom environment.

## Configuration

### Runtime Environment Schema

The runtime environment is defined in `.runtimeenvschema.json`:

```json
{
  "type": "object",
  "properties": {
    "FOO": {
      "type": "string"
    }
  },
  "required": ["FOO"]
}
```

### Environment Variables

Set environment variables in `.env` file:

```bash
FOO=my-value
```

Or pass them directly:

```bash
FOO=my-value npm run dev
```

## Webpack Configuration

Key webpack configuration features:

- **Entry**: `./src/index.ts`
- **TypeScript**: Compiled with `ts-loader`
- **HTML Plugin**: Uses interpolated HTML from cache in dev mode, original in production
- **Dev Server**: Serves static files from `public/` directory

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t comprehensive-webpack .

# Run container
docker run -p 8080:80 -e FOO=docker-value comprehensive-webpack
```

The Docker image:

- Builds with webpack in production mode
- Uses nginx to serve static files
- Generates runtime-env.js at container startup
- Interpolates index.html with environment values
- Uses SEA binaries for runtime-env CLI (no Node.js runtime overhead)

### Docker Environment Variables

Pass environment variables to the container:

```bash
docker run -p 8080:80 \
  -e FOO=my-docker-value \
  comprehensive-webpack
```

## Project Structure

```
comprehensive-webpack/
├── src/
│   ├── index.ts           # Application entry point
│   └── runtime-env.d.ts   # Generated TypeScript types
├── public/
│   └── runtime-env.js     # Generated runtime environment
├── tests/
│   └── runtime-env.test.ts # Jest tests
├── dist/
│   ├── index.html         # Generated HTML (built)
│   ├── index.bundle.js    # Generated bundle
│
├── webpack.config.js      # Webpack configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── package.json           # Dependencies and scripts
├── .runtimeenvschema.json # Runtime environment schema
├── index.html             # HTML template with <%= %> syntax
├── Dockerfile             # Multi-stage Docker build
├── start.sh               # Docker startup script
├── nginx.conf             # Nginx configuration
└── README.md              # This file
```

## How It Works

### Development Workflow

1. **gen-ts --watch**: Watches `.runtimeenvschema.json` and generates `src/runtime-env.d.ts`
2. **gen-js --watch**: Watches `.env` and schema, generates `public/runtime-env.js`
3. **interpolate --watch**: Watches `index.html` and environment, interpolates to cache
4. **webpack serve**: Serves from cache (interpolated HTML) and public directory

### Build Workflow

1. **gen-ts**: Generates TypeScript types once
2. **webpack build**: Builds in production mode, uses original `index.html`

### Preview Workflow

1. **gen-js**: Generates `public/runtime-env.js` from current environment
2. **interpolate**: Interpolates `index.html` with current environment
3. **webpack serve static**: Serves `dist/` directory with generated assets

### Test Workflow

1. **gen-ts**: Generates TypeScript types
2. **gen-js**: Generates `public/runtime-env.js`
3. **jest**: Runs tests with jsdom, loads `runtime-env.js` in `setupFilesAfterEnv`

### Docker Workflow

- **Build stage**: Runs `npm run build` to create production bundle in `dist/`
- **Runtime stage**:
  - Copies built files from `dist/` to nginx directory
  - Installs runtime-env SEA binaries
  - Runs `start.sh` at container startup:
    - Generates `runtime-env.js` from container environment
    - Interpolates `dist/index.html` with environment values
    - Starts nginx

## Comparison with Vite Example

This example demonstrates the same features as `comprehensive-vite` but uses Webpack:

| Feature     | Vite             | Webpack             |
| ----------- | ---------------- | ------------------- |
| Build tool  | Vite             | Webpack             |
| Dev server  | Vite dev server  | webpack-dev-server  |
| HTML plugin | vite-plugin-html | html-webpack-plugin |
| Test runner | Vitest           | Jest                |
| Entry point | src/index.ts     | src/index.ts        |
| TypeScript  | Native           | ts-loader           |

Both examples achieve feature parity with `@runtime-env/cli`.

## Troubleshooting

### TypeScript errors about `runtimeEnv`

Run `npm run dev` or `npm run build` to generate `src/runtime-env.d.ts`.

### Docker build fails

Ensure `.runtimeenvschema.json` is in the root directory and `start.sh` is executable.

### Tests fail with `runtimeEnv is not defined`

Ensure `public/runtime-env.js` exists by running `npm run test:runtime-env` first.

## License

MIT
