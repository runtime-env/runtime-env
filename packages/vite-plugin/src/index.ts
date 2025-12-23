import type { Plugin, UserConfig } from "vite";
import { devPlugin } from "./dev.js";
import { buildPlugin } from "./build.js";
import { previewPlugin } from "./preview.js";
import { vitestPlugin } from "./vitest.js";
import { transformHtml } from "./utils.js";
import { Options } from "./types.js";

export default function runtimeEnv(options: Options): Plugin {
  const dev = devPlugin(options);
  const build = buildPlugin(options);
  const preview = previewPlugin(options);
  const vitest = vitestPlugin(options);

  return {
    name: "@runtime-env/vite-plugin",

    config(config: UserConfig, configEnv) {
      if (configEnv.command === "serve") {
        // dev plugin doesn't have a config hook, but we check anyway or leave it out if we know.
        // Based on dev.ts, it has configResolved.
        // But types might infer it doesn't exist if not present in the returned object.
        // Safest is to just call what we know exists or cast if needed, but devPlugin inference should show configResolved.
        // Current logic in dev.ts has configResolved, not config.
        // So dev.config is undefined.
        return {};
      } else if (configEnv.command === "build") {
        return build.config?.(config, configEnv);
      } else if (configEnv.isPreview) {
        return preview.config?.(config, configEnv);
      } else if (config.mode === "test") {
        return vitest.config?.(config, configEnv);
      }
      return {};
    },

    configResolved(config) {
      if (config.command === "serve" && !(config as any).isPreview) {
        return dev.configResolved?.(config);
      } else if (config.command === "build") {
        return build.configResolved?.(config);
      }
    },

    configureServer(server) {
      if (server.config.command === "serve") {
        return dev.configureServer?.(server);
      }
    },

    configurePreviewServer(server) {
      return preview.configurePreviewServer?.(server);
    },

    transformIndexHtml(html, ctx) {
      const isBuild = !ctx.server;
      const isPreview = false;

      return transformHtml(html, options, isBuild, isPreview);
    },
  };
}
