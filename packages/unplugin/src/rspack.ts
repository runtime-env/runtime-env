/**
 * Rspack plugin for runtime-env integration.
 * @example
 * ```js
 * const runtimeEnv = require('@runtime-env/unplugin/rspack');
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
export { rspack as default } from "./index";
