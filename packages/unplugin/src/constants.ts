/**
 * Default configuration values for the runtime-env plugin.
 */
export const DEFAULT_SCHEMA_FILE = ".runtimeenvschema.json";
export const DEFAULT_GLOBAL_VARIABLE_NAME = "runtimeEnv";
export const DEFAULT_JS_OUTPUT_FILE = "runtime-env.js";
export const DEFAULT_PUBLIC_DIR = "public";
export const PLUGIN_NAME = "@runtime-env/unplugin";
export const CLI_BIN_NAME = "runtime-env";

/**
 * Error messages for the plugin.
 */
export const ERROR_MESSAGES = {
  HTML_PLUGIN_NOT_FOUND: (pluginName: string) =>
    `[${PLUGIN_NAME}] interpolate option requires ${pluginName}. ` +
    `Install ${pluginName} or remove the interpolate option.`,
  HTML_INTERPOLATION_NOT_SUPPORTED: (bundler: string, supported: string) =>
    `[${PLUGIN_NAME}] HTML interpolation is not supported in ${bundler}. ` +
    `Supported bundlers: ${supported}. ` +
    `Remove the interpolate option or switch to a supported bundler.`,
  CLI_COMMAND_FAILED: (command: string, error: string) =>
    `CLI ${command} failed: ${error}`,
};
