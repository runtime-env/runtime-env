import type { Compilation } from "webpack";
import { ERROR_MESSAGES } from "../constants";

/**
 * Types for html-webpack-plugin and html-rspack-plugin hooks.
 */
export interface HtmlPluginData {
  plugin: {
    options: {
      templateParameters?: Record<string, unknown>;
    };
  };
}

export interface HtmlPluginHooks {
  beforeAssetTagGeneration: {
    tapAsync: (
      name: string,
      callback: (
        data: HtmlPluginData,
        cb: (error: Error | null, data?: HtmlPluginData) => void,
      ) => void,
    ) => void;
  };
}

export interface HtmlPluginConstructor {
  getHooks: (compilation: Compilation) => HtmlPluginHooks;
}

/**
 * Finds the HTML plugin constructor from compiler plugins.
 * Works for both html-webpack-plugin and html-rspack-plugin.
 */
export function findHtmlPlugin(
  plugins: unknown[] | undefined,
): HtmlPluginConstructor | null {
  if (!plugins) return null;

  for (const plugin of plugins) {
    if (
      plugin &&
      typeof plugin === "object" &&
      "constructor" in plugin &&
      plugin.constructor &&
      typeof (plugin.constructor as unknown as HtmlPluginConstructor).getHooks ===
        "function"
    ) {
      return plugin.constructor as unknown as HtmlPluginConstructor;
    }
  }

  return null;
}

/**
 * Creates template parameters for HTML plugin.
 * In dev mode, returns actual env values.
 * In production, returns a Proxy that outputs template syntax.
 */
export function createTemplateParameters(
  globalVariableName: string,
  envValues: Record<string, unknown> | null,
  existingParams?: Record<string, unknown>,
): Record<string, unknown> {
  if (envValues) {
    // Dev mode: use actual values
    return {
      ...existingParams,
      [globalVariableName]: envValues,
    };
  } else {
    // Production mode: use Proxy to preserve template syntax
    const escapeProxy = new Proxy(
      {},
      {
        get(_, prop) {
          return `<%= ${globalVariableName}.${String(prop)} %>`;
        },
      },
    );
    return {
      ...existingParams,
      [globalVariableName]: escapeProxy,
    };
  }
}

/**
 * Validates that the HTML plugin is available.
 * Throws an error if not found.
 */
export function validateHtmlPlugin(
  plugin: HtmlPluginConstructor | null,
  pluginName: string,
): asserts plugin is HtmlPluginConstructor {
  if (!plugin) {
    throw new Error(ERROR_MESSAGES.HTML_PLUGIN_NOT_FOUND(pluginName));
  }
}
