import unplugin from "./index";

/**
 * Webpack plugin for runtime-env integration.
 * @example
 * ```js
 * const runtimeEnv = require('@runtime-env/unplugin/webpack');
 *
 * module.exports = {
 *   plugins: [
 *     runtimeEnv({
 *       ts: { outputFile: 'src/runtime-env.d.ts' },
 *       js: { envFile: ['.env'] },
 *       interpolate: { envFile: ['.env'] },
 *     }),
 *   ],
 * };
 * ```
 */
export default unplugin.webpack;
