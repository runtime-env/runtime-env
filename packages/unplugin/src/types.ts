/**
 * Options for configuring the @runtime-env/unplugin plugin.
 */
export interface RuntimeEnvOptions {
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

/**
 * Supported bundler types.
 */
export type Bundler =
  | "vite"
  | "webpack"
  | "rspack"
  | "rollup"
  | "esbuild"
  | "rolldown";
