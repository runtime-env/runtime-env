import unplugin from "./index";

/**
 * Vite plugin for runtime-env integration.
 * @example
 * ```ts
 * import { defineConfig } from 'vite';
 * import runtimeEnv from '@runtime-env/unplugin/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     runtimeEnv({
 *       ts: { outputFile: 'src/runtime-env.d.ts' },
 *       js: { envFile: ['.env'] },
 *       interpolate: { envFile: ['.env'] },
 *     }),
 *   ],
 * });
 * ```
 */
export default unplugin.vite;
