# Comprehensive Runtime Environment Example

This example demonstrates all key workflows for using `@runtime-env/cli` with a Vite + TypeScript application:

- **Development mode** with live reloading of environment variables
- **Testing** with vitest loading generated runtime environment
- **Production builds** with type-safe environment variables
- **Preview mode** for testing production builds locally
- **Docker deployment** using single executable applications (SEA)
- **PWA support** with Workbox service worker and runtime-env.js cache busting

## Project Structure

```
comprehensive/
├── index.html              # HTML template with <%= runtimeEnv.FOO %> placeholders
├── public/
│   ├── runtime-env.js      # Generated runtime JS (git-ignored)
│   └── vite.svg            # Vite logo
├── src/
│   ├── main.ts             # Main application code using globalThis.runtimeEnv
│   └── runtime-env.d.ts    # Generated TypeScript declarations (git-ignored)
├── tests/
│   └── runtime-env.test.ts # Unit tests for runtime environment
├── scripts/
│   └── patch-runtime-env-revision.cjs # Service worker cache busting (optional)
├── .env                    # Local environment variables (git-ignored)
├── .runtimeenvschema.json  # JSON schema defining environment variables
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf              # Nginx configuration
├── start.sh                # Container startup script
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite and Vitest configuration with PWA plugin

```

## Key Features

### 1. Development Mode

In development, we run three `runtime-env` commands in parallel with Vite:

```bash
npm run dev
```

This runs (via `concurrently --kill-others-on-fail`):

- `runtime-env --watch gen-ts` - Generates TypeScript declarations for type safety
- `runtime-env --watch gen-js` - Generates runtime-env.js from .env file
- `runtime-env --watch interpolate` - Interpolates HTML with env values to cache
- `vite` - Starts Vite dev server serving interpolated HTML from cache

**Benefits:**

- Live reload when .env changes
- Type-safe environment variable access
- No build step required for env changes

### 2. Testing

```bash
npm test
```

This runs:

- `runtime-env gen-ts` - Generates types for test files
- `runtime-env gen-js` - Generates runtime-env.js for tests
- `vitest --run` - Runs unit tests

Tests load the generated `public/runtime-env.js` directly via vitest's `setupFiles: ["./public/runtime-env.js"]` configuration and verify both runtime behavior and TypeScript types using `expectTypeOf`.

### 3. Production Build

```bash
npm run build
```

This runs:

- `runtime-env gen-ts` - Generates TypeScript declarations only
- `tsc && vite build` - Type checks and builds the application

**Note:** We only generate TypeScript declarations at build time. The actual runtime-env.js and HTML interpolation happen at container startup, allowing the same build to work across multiple environments.

### 4. Preview Mode

```bash
npm run preview
```

This runs:

- `runtime-env gen-js` - Generates runtime-env.js from current .env
- Creates/restores `index.html.bak` backup
- `runtime-env interpolate` - Interpolates HTML with env values
- `vite preview` - Starts preview server

**Benefits:**

- Test production builds locally
- Verify interpolation works correctly
- Can run multiple times with different .env values

### 5. Docker Deployment

```bash
# Build the image
docker build -t runtime-env-comprehensive .

# Run with custom environment variables
docker run -it --rm -p 80:80 -e FOO=production runtime-env-comprehensive
```

The Dockerfile:

1. Builds the application (`npm run build`)
2. Creates single executable applications (SEA) for runtime-env CLI and patch-runtime-env-revision
3. Copies build artifacts to nginx image
4. Runs start.sh which:
   - Generates runtime-env.js from environment variables
   - Interpolates index.html with environment values
   - Patches service worker revision hash for runtime-env.js (ensures fresh values on updates)
   - Starts nginx

**Benefits:**

- Single Docker image works across all environments
- No rebuild required for different env values

### 6. PWA and Service Worker

The example uses `vite-plugin-pwa` with Workbox to generate a service worker that caches the application for offline use. The service worker includes `runtime-env.js` in its precache manifest with a placeholder revision.

**Cache busting for runtime-env.js:**

At container startup, the `patch-runtime-env-revision.cjs` script:

1. Calculates the MD5 hash of the generated `runtime-env.js` file
2. Replaces the `"placeholder"` revision in `sw.js` with the actual hash
3. Ensures the service worker fetches fresh `runtime-env.js` when environment values change

This approach allows the service worker to properly cache all assets while ensuring `runtime-env.js` is always up-to-date with the current environment variables.

## Environment Variables

Environment variables are defined in `.runtimeenvschema.json`:

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

Access them in your code:

```typescript
// TypeScript automatically knows about runtimeEnv.FOO
const value = globalThis.runtimeEnv.FOO;
```

## Scripts Reference

| Script            | Purpose                      | Generates                                |
| ----------------- | ---------------------------- | ---------------------------------------- |
| `npm run dev`     | Development with live reload | gen-ts, gen-js, interpolate (watch mode) |
| `npm run build`   | Production build             | gen-ts only                              |
| `npm test`        | Run unit tests               | gen-ts, gen-js                           |
| `npm run preview` | Preview production build     | gen-js, interpolate                      |

## Configuration Files

### tsconfig.json

Includes `src/**/*.d.ts` and `tests/**/*.ts` to automatically pick up generated type declarations and test files.

### vite.config.ts

- Includes a Vite plugin that serves interpolated HTML from cache during development
- Configures vitest with `setupFiles: ["./public/runtime-env.js"]` to load generated runtime environment in tests
- Configures vite-plugin-pwa with Workbox to generate service worker
- Adds `runtime-env.js` to service worker manifest with placeholder revision (patched at container startup)
- Disables `publicDir` to prevent automatic copying of public assets

### .gitignore

Ignores generated files:

- `/public/runtime-env.js`
- `/src/runtime-env.d.ts`
- `/node_modules/.cache/runtime-env/`
- `*.bak`
- `.env`

## Core Principles

1. **Avoid rebuilds** - Runtime environment changes shouldn't require application rebuilds
2. **Type safety** - TypeScript declarations ensure type-safe access to environment variables
3. **Single Docker image** - Same build artifact works across all environments
4. **No modification of generated files** - Generated files are cached and regenerated as needed

## E2E Testing

This example includes comprehensive end-to-end tests using Cypress to verify all workflows:

### Test Modes

1. **Dev Mode** (`cypress/e2e/dev.cy.js`)
   - Verifies dev server starts on port 5173
   - Verifies runtime-env values are displayed
   - Verifies HMR updates when .env changes

2. **Preview Mode** (`cypress/e2e/preview.cy.js`)
   - Verifies preview server serves interpolated content
   - Verifies service worker loads correctly
   - Verifies preview can be rerun with different env values

3. **Docker Mode** (`cypress/e2e/docker.cy.js`)
   - Verifies Docker image builds successfully
   - Verifies container serves app with runtime injection
   - Verifies service worker is patched
   - Verifies containers can be restarted with different env values

### Running Tests Locally

**Prerequisites:**
- Node.js and npm
- Docker (for docker tests)
- Cypress dependencies installed (`npm ci`)

**Run dev mode test:**
```bash
echo "FOO=test-value" > .env
npx start-server-and-test 'npm run dev' http://localhost:5173 'npx cypress run --spec cypress/e2e/dev.cy.js'
```

**Run preview mode test:**
```bash
npm run build
echo "FOO=test-value" > .env
npx start-server-and-test 'npm run preview' http://localhost:4173 'npx cypress run --spec cypress/e2e/preview.cy.js'
```

**Run docker test:**
```bash
docker build . -t runtime-env-comprehensive-vite
npx start-server-and-test 'docker run -p 3000:80 -e FOO=test-value runtime-env-comprehensive-vite' http://localhost:3000 'npx cypress run --spec cypress/e2e/docker.cy.js'
# Clean up
docker ps -a -q -f ancestor=runtime-env-comprehensive-vite | xargs -r docker rm -f
```

### CI Integration

All test modes run in CI with proper environment isolation:
- Each test mode runs in a separate CI step
- `git clean -xdf` runs between modes to ensure clean state
- Tests use the packed tarball installation pattern
- Builds run WITHOUT .env file to preserve template syntax
- Docker containers are properly cleaned up after tests

## Learn More

- [@runtime-env/cli documentation](../../packages/cli/README.md)
