# Design: @runtime-env/unplugin

## Architecture

The unplugin provides a unified plugin interface that adapts to different build tools (Vite, Webpack, Rollup, esbuild, Rspack) through the unplugin framework.

### Package Structure

```
packages/unplugin/
├── src/
│   ├── index.ts              # Main plugin factory
│   ├── core.ts               # Core plugin logic (build tool agnostic, bundler detection)
│   ├── generators.ts         # Wrappers for CLI gen-ts, gen-js, interpolate with --watch
│   ├── vite.ts               # Vite-specific adaptations
│   ├── webpack.ts            # Webpack-specific adaptations
│   └── types.ts              # TypeScript type definitions
├── package.json              # CLI is a peer dependency
├── tsconfig.json
└── README.md
```

### Bundler Detection

Instead of having each bundler hook throw errors individually, the plugin detects which bundler is being used and validates interpolate support centrally:

```typescript
// packages/unplugin/src/core.ts
export type Bundler =
  | "vite"
  | "webpack"
  | "rspack"
  | "rollup"
  | "esbuild"
  | "rolldown";

const BUNDLERS_WITH_HTML_SUPPORT: Bundler[] = ["vite", "webpack", "rspack"];

export function validateInterpolateSupport(
  bundler: Bundler,
  hasInterpolate: boolean,
): void {
  if (hasInterpolate && !BUNDLERS_WITH_HTML_SUPPORT.includes(bundler)) {
    const supported = BUNDLERS_WITH_HTML_SUPPORT.join(", ");
    throw new Error(
      `[@runtime-env/unplugin] HTML interpolation is not supported in ${bundler}. ` +
        `Supported bundlers: ${supported}. ` +
        `Remove the interpolate option or switch to a supported bundler.`,
    );
  }
}

export function getBundlerName(id: string): Bundler {
  // unplugin provides context about which bundler is being used
  // This will be set by the unplugin framework
  return id as Bundler;
}
```

### Plugin Options

```typescript
interface RuntimeEnvOptions {
  /**
   * Path to the JSON schema file that defines environment variables.
   * @default '.runtimeenvschema.json'
   */
  schemaFile?: string;

  /**
   * Global variable name used to expose runtime environment variables.
   * @default 'runtimeEnv'
   */
  globalVariableName?: string;

  /**
   * TypeScript type generation options.
   * If provided, TypeScript declarations will be generated.
   */
  ts?: {
    /**
     * Output path for generated TypeScript declaration file (REQUIRED).
     * @example 'src/runtime-env.d.ts'
     */
    outputFile: string;
  };

  /**
   * JavaScript runtime file generation options.
   * If provided, runtime JavaScript will be generated.
   */
  js?: {
    /**
     * Output path for generated JavaScript runtime file.
     * Defaults based on bundler:
     * - Vite: '{publicDir}/runtime-env.js' (usually 'public/runtime-env.js')
     * - Webpack/Rspack: 'public/runtime-env.js'
     * - Rollup: '{output.dir}/runtime-env.js' or 'runtime-env.js'
     * - esbuild: '{outdir}/runtime-env.js' or 'runtime-env.js'
     * @example 'public/runtime-env.js'
     */
    outputFile?: string;

    /**
     * Environment file(s) to load. Can be a single file path or an array of paths.
     * When empty, environment variables are read from process.env.
     * NOTE: Unlike bundlers, .env is NOT loaded automatically. You must explicitly
     * specify envFile: ['.env'] if you want to load it.
     * @default []
     */
    envFile?: string | string[];
  };

  /**
   * HTML interpolation options.
   * If provided, HTML template interpolation will be performed.
   *
   * HTML is automatically detected by the bundler:
   * - Vite: Uses transformIndexHtml hook (processes index.html automatically)
   * - Webpack: Requires html-webpack-plugin (uses plugin's configured template)
   * - Rspack: Requires html-rspack-plugin (uses plugin's configured template)
   *
   * NOT supported in: Rollup, esbuild, Rolldown (throws error)
   */
  interpolate?: {
    /**
     * Environment file(s) to load. Can be a single file path or an array of paths.
     * When empty, environment variables are read from process.env.
     * NOTE: Unlike bundlers, .env is NOT loaded automatically. You must explicitly
     * specify envFile: ['.env'] if you want to load it.
     * @default []
     */
    envFile?: string | string[];
  };
}
```

### Core Logic Flow

#### Development Mode

1. **Plugin initialization**
   - Load options with defaults
   - Validate schema file exists
   - Start CLI watch mode processes for TypeScript and JavaScript

2. **Start CLI watch processes**
   - Spawn `runtime-env --watch gen-ts` for type generation
   - Spawn `runtime-env --watch gen-js` for runtime JS generation
   - CLI handles all file watching internally (schema, env files)
   - Keep processes running until dev server stops

3. **HTML transformation** (NO separate interpolate watch process)
   - **Vite**: Use `transformIndexHtml` hook to inline transform HTML with runtime env values
   - **Webpack**: Use `HtmlWebpackPlugin.getHooks(compilation).beforeTemplateExecution` to inject templateParameters
   - **Rspack**: Use `html-rspack-plugin` hooks to inject templateParameters

#### Build Mode

1. **Pre-build**
   - Clean up `public/runtime-env.js` if exists
   - Generate `src/runtime-env.d.ts` once (for type checking)

2. **HTML processing**
   - **Vite**: `transformIndexHtml` returns HTML unchanged (template syntax passes through)
   - **Webpack**: HTML passes through unchanged (no hook needed)
   - **Rspack**: HTML passes through unchanged (no hook needed)
   - Template syntax `<%= runtimeEnv.FOO %>` is preserved for server-side processing

3. **Post-build**
   - Verify `dist/index.html` contains unprocessed `<%= runtimeEnv.FOO %>`
   - Emit warning if runtime-env placeholders are missing

### Build Tool Adaptations

Using unplugin's unified hooks to minimize build-tool-specific code:

```typescript
// packages/unplugin/src/index.ts
import { createUnplugin } from "unplugin";
import { validateInterpolateSupport, type Bundler } from "./core";

export default createUnplugin<RuntimeEnvOptions>((options, meta) => {
  let watchProcesses: WatchProcesses | null = null;
  let isDev = false;
  const bundler = meta.framework as Bundler;

  // Validate interpolate support for this bundler
  validateInterpolateSupport(bundler, !!options.interpolate);

  return {
    name: "runtime-env",

    // Unified hooks work across all bundlers
    buildStart() {
      // In dev mode, start CLI watch processes
      if (isDev) {
        watchProcesses = startWatchProcesses(options);
      } else {
        // In build mode, generate types once (for type checking)
        if (options.ts) {
          await genTypes(
            options.schemaFile || ".runtimeenvschema.json",
            options.ts.outputFile,
            options.globalVariableName,
          );
        }
        // Clean runtime-env.js if it exists
        if (options.js) {
          const jsPath = path.resolve(options.js.outputFile);
          if (fs.existsSync(jsPath)) {
            fs.unlinkSync(jsPath);
          }
        }
      }
    },

    buildEnd() {
      // Cleanup watch processes
      if (watchProcesses) {
        stopWatchProcesses(watchProcesses);
        watchProcesses = null;
      }
    },

    // Vite-specific: transform HTML
    vite: {
      configResolved(config) {
        isDev = config.command === "serve";
        // Set default js outputFile based on Vite's publicDir
        if (options.js && !options.js.outputFile) {
          const publicDir = config.publicDir || "public";
          options.js.outputFile = path.join(publicDir, "runtime-env.js");
        }
      },

      transformIndexHtml: {
        enforce: "pre",
        async transform(html) {
          if (!options.interpolate) return html;

          if (isDev) {
            // Dev: inline interpolate HTML with runtime env values
            const interpolated = await interpolateHtml(
              html,
              options.schemaFile || ".runtimeenvschema.json",
              options.globalVariableName || "runtimeEnv",
              options.interpolate.envFile,
            );
            return interpolated;
          } else {
            // Build: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
            // Server-side runtime-env CLI will process this at container startup
            return html;
          }
        },
      },
    },

    // Webpack-specific: HtmlWebpackPlugin integration
    webpack(compiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Webpack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
        // Hook into HtmlWebpackPlugin to handle HTML template
        compiler.hooks.compilation.tap("RuntimeEnvPlugin", (compilation) => {
          const HtmlWebpackPlugin = compiler.options.plugins?.find(
            (p) => p.constructor.name === "HtmlWebpackPlugin",
          )?.constructor;

          if (!HtmlWebpackPlugin) {
            throw new Error(
              "[@runtime-env/unplugin] interpolate option requires html-webpack-plugin. " +
                "Install html-webpack-plugin or remove the interpolate option.",
            );
          }

          const hooks = HtmlWebpackPlugin.getHooks(compilation);

          if (isDev) {
            // Dev: inject templateParameters with runtime env values
            hooks.beforeTemplateExecution.tapAsync(
              "RuntimeEnvPlugin",
              async (data, cb) => {
                const envValues = await loadEnvValues(
                  options.schemaFile || ".runtimeenvschema.json",
                  options.interpolate.envFile,
                );
                data.plugin.options.templateParameters = {
                  ...data.plugin.options.templateParameters,
                  [options.globalVariableName || "runtimeEnv"]: envValues,
                };
                cb(null, data);
              },
            );
          } else {
            // Production: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
            // Server-side runtime-env CLI will process this at container startup
            // No transformation needed - HTML passes through unchanged
          }
        });
      }
    },

    // Rspack-specific: html-rspack-plugin integration
    rspack(compiler) {
      isDev = compiler.options.mode !== "production";

      // Set default js outputFile for Rspack
      if (options.js && !options.js.outputFile) {
        options.js.outputFile = "public/runtime-env.js";
      }

      if (options.interpolate) {
        // Hook into html-rspack-plugin to handle HTML template
        compiler.hooks.compilation.tap("RuntimeEnvPlugin", (compilation) => {
          // html-rspack-plugin has similar API to html-webpack-plugin
          const HtmlRspackPlugin = compiler.options.plugins?.find(
            (p) => p.constructor.name === "HtmlRspackPlugin",
          )?.constructor;

          if (!HtmlRspackPlugin) {
            throw new Error(
              "[@runtime-env/unplugin] interpolate option requires html-rspack-plugin. " +
                "Install html-rspack-plugin or remove the interpolate option.",
            );
          }

          const hooks = HtmlRspackPlugin.getHooks(compilation);

          if (isDev) {
            // Dev: inject templateParameters with runtime env values
            hooks.beforeTemplateExecution.tapAsync(
              "RuntimeEnvPlugin",
              async (data, cb) => {
                const envValues = await loadEnvValues(
                  options.schemaFile || ".runtimeenvschema.json",
                  options.interpolate.envFile,
                );
                data.plugin.options.templateParameters = {
                  ...data.plugin.options.templateParameters,
                  [options.globalVariableName || "runtimeEnv"]: envValues,
                };
                cb(null, data);
              },
            );
          } else {
            // Production: keep template syntax as-is (<%= runtimeEnv.FOO %> stays unchanged)
            // Server-side runtime-env CLI will process this at container startup
            // No transformation needed - HTML passes through unchanged
          }
        });
      }
    },

    // Rollup-specific: set defaults (no HTML support)
    rollup: {
      options(rollupOptions) {
        // Set default js outputFile based on Rollup's output.dir
        if (options.js && !options.js.outputFile) {
          if (rollupOptions.output?.dir) {
            options.js.outputFile = path.join(
              rollupOptions.output.dir,
              "runtime-env.js",
            );
          } else {
            options.js.outputFile = "runtime-env.js";
          }
        }
        return rollupOptions;
      },
    },

    // esbuild-specific: set defaults (no HTML support)
    esbuild: {
      setup(build) {
        // Set default js outputFile based on esbuild's outdir
        if (options.js && !options.js.outputFile) {
          if (build.initialOptions.outdir) {
            options.js.outputFile = path.join(
              build.initialOptions.outdir,
              "runtime-env.js",
            );
          } else if (build.initialOptions.outfile) {
            // If using outfile, put runtime-env.js in the same directory
            options.js.outputFile = path.join(
              path.dirname(build.initialOptions.outfile),
              "runtime-env.js",
            );
          } else {
            options.js.outputFile = "runtime-env.js";
          }
        }
      },
    },
  };
});
```

### Generator Wrappers

The plugin spawns CLI commands with `--watch` flag in development mode for TypeScript and JavaScript generation. HTML interpolation is handled directly in build tool hooks:

```typescript
// packages/unplugin/src/generators.ts
import { spawn, ChildProcess } from "child_process";
import { execSync } from "child_process";

interface WatchProcesses {
  genTs?: ChildProcess;
  genJs?: ChildProcess;
}

export function startWatchProcesses(
  options: RuntimeEnvOptions,
): WatchProcesses {
  const processes: WatchProcesses = {};
  const schemaFile = options.schemaFile || ".runtimeenvschema.json";
  const globalVarName = options.globalVariableName || "runtimeEnv";

  // Start gen-ts watch if ts option is provided
  if (options.ts) {
    const args = [
      "@runtime-env/cli",
      "--watch",
      "--schema-file",
      schemaFile,
      "--global-variable-name",
      globalVarName,
      "gen-ts",
      "--output-file",
      options.ts.outputFile,
    ];
    processes.genTs = spawn("npx", args, { stdio: "inherit" });
  }

  // Start gen-js watch if js option is provided
  if (options.js) {
    const envFiles = Array.isArray(options.js.envFile)
      ? options.js.envFile
      : options.js.envFile
        ? [options.js.envFile]
        : [];

    const args = [
      "@runtime-env/cli",
      "--watch",
      "--schema-file",
      schemaFile,
      "--global-variable-name",
      globalVarName,
      "gen-js",
      "--output-file",
      options.js.outputFile,
    ];
    envFiles.forEach((f) => args.push("--env-file", f));
    processes.genJs = spawn("npx", args, { stdio: "inherit" });
  }

  return processes;
}

export function stopWatchProcesses(processes: WatchProcesses): void {
  Object.values(processes).forEach((proc) => {
    if (proc && !proc.killed) {
      proc.kill();
    }
  });
}

// One-time generation for build mode (no watch)
export async function genTypes(
  schemaFile: string,
  output: string,
  globalVariableName?: string,
) {
  return new Promise((resolve, reject) => {
    const args = [
      "@runtime-env/cli",
      "--schema-file",
      schemaFile,
      "gen-ts",
      "--output-file",
      output,
    ];
    if (globalVariableName) {
      args.splice(2, 0, "--global-variable-name", globalVariableName);
    }
    const proc = spawn("npx", args, { stdio: "inherit" });
    proc.on("close", (code) => (code === 0 ? resolve() : reject()));
  });
}

// HTML interpolation helpers (use CLI directly via execSync)
export async function interpolateHtml(
  html: string,
  schemaFile: string,
  globalVariableName: string,
  envFile?: string | string[],
): Promise<string> {
  const envFiles = Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];

  // Write HTML to temp file
  const tempInput = path.join(os.tmpdir(), `runtime-env-${Date.now()}.html`);
  const tempOutput = path.join(
    os.tmpdir(),
    `runtime-env-${Date.now()}-out.html`,
  );
  fs.writeFileSync(tempInput, html);

  const args = [
    "npx",
    "@runtime-env/cli",
    "--schema-file",
    schemaFile,
    "--global-variable-name",
    globalVariableName,
    "interpolate",
    "--input-file",
    tempInput,
    "--output-file",
    tempOutput,
  ];
  envFiles.forEach((f) => args.push("--env-file", f));

  execSync(args.join(" "), { stdio: "inherit" });
  const result = fs.readFileSync(tempOutput, "utf-8");

  // Cleanup
  fs.unlinkSync(tempInput);
  fs.unlinkSync(tempOutput);

  return result;
}

export async function loadEnvValues(
  schemaFile: string,
  envFile?: string | string[],
): Promise<Record<string, any>> {
  const envFiles = Array.isArray(envFile) ? envFile : envFile ? [envFile] : [];

  // Use CLI to generate JS temporarily and parse it to extract values
  const tempOutput = path.join(os.tmpdir(), `runtime-env-${Date.now()}.js`);

  const args = [
    "npx",
    "@runtime-env/cli",
    "--schema-file",
    schemaFile,
    "gen-js",
    "--output-file",
    tempOutput,
  ];
  envFiles.forEach((f) => args.push("--env-file", f));

  execSync(args.join(" "), { stdio: "inherit" });
  const jsContent = fs.readFileSync(tempOutput, "utf-8");

  // Parse the generated JS to extract values
  // The JS file assigns to window[globalVariableName], extract that object
  const matches = jsContent.match(/window\[['"](\w+)['"]\]\s*=\s*({[^;]+});/);
  if (matches && matches[2]) {
    const envValues = JSON.parse(matches[2]);
    fs.unlinkSync(tempOutput);
    return envValues;
  }

  fs.unlinkSync(tempOutput);
  return {};
}
```

## Trade-offs

### CLI as Peer Dependency

**Decision**: Make `@runtime-env/cli` a peer dependency instead of a direct dependency.

**Rationale**:

- Users likely already have CLI installed for production use (Docker containers)
- Avoids version conflicts between plugin and user's CLI installation
- Clear separation: unplugin is a development tool, CLI is for both dev and prod
- Explicit dependency management (users see what they're installing)

**Trade-off**: Requires users to install both packages, but this is standard practice and documented clearly.

### CLI Execution vs Import

**Decision**: Execute CLI via `npx` rather than importing CLI code.

**Rationale**:

- Avoids bundling all CLI dependencies into the plugin
- Clearer separation of concerns
- Users get consistent CLI behavior
- Simpler to maintain (no shared code between packages)

**Trade-off**: Slightly slower execution due to process spawning, but negligible in watch mode and only once per build.

### HTML Template Strategy

**Decision**: Use build tool hooks directly for HTML transformation instead of file watching.

**Rationale**:

- Development: Inline interpolate HTML with actual env values for immediate feedback
  - Vite: Use `transformIndexHtml` hook
  - Webpack/Rspack: Use `templateParameters` hook
- Production: Pass HTML through unchanged (template syntax preserved)
  - Server-side `runtime-env interpolate` processes `<%= %>` at container startup
  - No escaping or modification needed at build time
- No separate interpolate watch process needed
- Leverages each bundler's native HTML handling capabilities

**Trade-off**: Build tool-specific code in hooks, but eliminates need for cached files and provides better integration with hot reload.

### Bundler Detection Strategy

**Decision**: Centralized bundler detection and validation instead of individual hook error throwing.

**Rationale**:

- Uses unplugin's `meta.framework` to detect which bundler is running
- Single source of truth for supported bundlers (`BUNDLERS_WITH_HTML_SUPPORT` array)
- Easy to add new bundler support by updating the array
- Validation happens once at plugin initialization (fail fast)
- Clear error messages that list all supported bundlers
- Future-proof: adding Farm, Rolldown, or other bundlers only requires updating the array

**Trade-off**: Error is thrown earlier (plugin init) rather than when hook executes, but this is better UX (immediate feedback).

### Watch Implementation

**Decision**: Use runtime-env CLI's built-in `--watch` flag instead of implementing custom file watching.

**Rationale**:

- CLI already has robust watch mode with chokidar internally
- Eliminates duplicate file watching logic
- No additional dependencies in unplugin package
- Consistent watch behavior across all usage patterns
- Simpler plugin implementation

**Trade-off**: Multiple long-running processes in development, but they're lightweight and managed automatically.

### Default Paths

**Decision**: Match current comprehensive examples' conventions.

**Rationale**:

- Users familiar with examples get zero-config experience
- Aligns with common frontend project structures
- Easy to override via options

**Trade-off**: Might not match all project structures, but customizable.

## Migration Path

Users of comprehensive-vite or comprehensive-webpack:

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
    "concurrently": "^9.2.1",
    "vite": "^7.2.6"
  }
}
```

**After:**

```json
{
  "scripts": {
    "dev": "vite"
  },
  "devDependencies": {
    "@runtime-env/unplugin": "^1.0.0",
    "vite": "^7.2.6"
  }
}
```

**vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import runtimeEnv from "@runtime-env/unplugin/vite";

export default defineConfig({
  plugins: [
    runtimeEnv({
      interpolate: {
        inputFile: "index.html",
      },
      // All other defaults work for comprehensive-vite structure
    }),
  ],
});
```

**webpack.config.js:**

```javascript
const runtimeEnv = require("@runtime-env/unplugin/webpack");

module.exports = {
  plugins: [
    runtimeEnv({
      interpolate: {
        inputFile: "index.html",
      },
      // All other defaults work for comprehensive-webpack structure
    }),
  ],
};
```

## Testing Strategy

1. **Unit tests**: Test generator wrappers, option parsing, path resolution
2. **Integration tests**: Test with actual Vite and Webpack projects
3. **E2E tests**: Run dev, build, and verify generated files
4. **Example updates**: comprehensive-vite and comprehensive-webpack serve as living documentation

## Open Questions

1. Should we bundle the CLI or always execute externally? → Decision: Execute externally (see trade-offs)
2. How to handle preview mode (gen-js, interpolate, PWA patching)? → Decision: Out of scope for v1, remains manual
3. Should plugin support test runner integration? → Decision: If test runner reuses plugins (e.g., Vitest can reuse Vite plugin config), it works automatically. If test runner is independent, test scripts remain simple (just ensure files exist before running tests).
4. Should CLI be peer dependency or direct dependency? → Decision: Peer dependency (see trade-offs)
