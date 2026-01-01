import type { Plugin, ResolvedConfig } from "vite";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  logError,
  hasRuntimeEnvScript,
} from "./utils.js";

export function buildPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "runtime-env-build",

    apply: "build",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
      if (isTypeScriptProject(config.root)) {
        const result = runRuntimeEnvCommand("gen-ts", "src/runtime-env.d.ts");
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

    transformIndexHtml(html) {
      if (!hasRuntimeEnvScript(html, config.base)) {
        logError(
          config.logger,
          `index.html is missing <script src="${config.base === "/" ? "" : config.base}/runtime-env.js"></script>. ` +
            "This script tag is mandatory for @runtime-env/vite-plugin to function correctly in production.",
        );
        process.exit(1);
      }
    },
  };
}
