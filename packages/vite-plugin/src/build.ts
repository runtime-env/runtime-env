import type { Plugin, ResolvedConfig } from "vite";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  validateSchema,
  logError,
  hasRuntimeEnvScript,
} from "./utils.js";

export function buildPlugin(): Plugin {
  let config: ResolvedConfig;
  const placeholders: string[] = [];

  return {
    name: "runtime-env-build",

    apply: "build",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      const validation = validateSchema(config.root, config.envPrefix);
      if (!validation.success) {
        logError(config.logger, "Schema validation failed", validation.message);
        process.exit(1);
      }

      if (isTypeScriptProject(config.root)) {
        const result = runRuntimeEnvCommand("gen-ts");
        if (!result.success) {
          logError(
            config.logger,
            "Failed to generate runtime-env.d.ts",
            result.stderr || result.stdout,
          );
          process.exit(1);
        }
      }
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (!hasRuntimeEnvScript(html, config.base)) {
          logError(
            config.logger,
            `index.html is missing <script src="${config.base === "/" ? "" : config.base}/runtime-env.js"></script>. ` +
              "This script tag is mandatory for @runtime-env/vite-plugin to function correctly in production.",
          );
          process.exit(1);
        }

        return html.replace(
          /<%[\s\S]+?%>/g,
          (placeholder) =>
            `__RUNTIME_ENV_PLACEHOLDER_${placeholders.push(placeholder) - 1}__`,
        );
      },
    },

    generateBundle: {
      order: "post",
      handler(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type !== "asset" || !file.fileName.endsWith(".html")) {
            continue;
          }
          const source =
            typeof file.source === "string"
              ? file.source
              : new TextDecoder().decode(file.source);
          file.source = source.replace(
            /__RUNTIME_ENV_PLACEHOLDER_(\d+)__/g,
            (_, index) => placeholders[Number(index)],
          );
        }
      },
    },
  };
}
