import unplugin from "./index";

/**
 * Rollup plugin for runtime-env integration.
 * Note: HTML interpolation is not supported in Rollup.
 * @example
 * ```js
 * import runtimeEnv from '@runtime-env/unplugin/rollup';
 *
 * export default {
 *   plugins: [
 *     runtimeEnv({
 *       ts: { outputFile: 'src/runtime-env.d.ts' },
 *       js: { envFile: ['.env'] },
 *     }),
 *   ],
 * };
 * ```
 */
export default unplugin.rollup;
