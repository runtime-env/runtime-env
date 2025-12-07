import unplugin from "./index";

/**
 * esbuild plugin for runtime-env integration.
 * Note: HTML interpolation is not supported in esbuild.
 * @example
 * ```js
 * const runtimeEnv = require('@runtime-env/unplugin/esbuild');
 * const esbuild = require('esbuild');
 *
 * esbuild.build({
 *   plugins: [
 *     runtimeEnv({
 *       ts: { outputFile: 'src/runtime-env.d.ts' },
 *       js: { envFile: ['.env'] },
 *     }),
 *   ],
 * });
 * ```
 */
export default unplugin.esbuild;
