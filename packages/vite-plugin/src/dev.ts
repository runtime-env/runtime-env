import type { Plugin, ViteDevServer } from "vite";
import { resolve } from "path";
import { writeFileSync, readFileSync, rmSync, existsSync } from "fs";
import {
  isTypeScriptProject,
  runRuntimeEnvCommand,
  getTempDir,
  getViteEnvFiles,
  validateSchema,
  logError,
  clearLastError,
  hasRuntimeEnvScript,
} from "./utils.js";

const schemaFile = ".runtimeenvschema.json";

export function devPlugin(): Plugin {
  return {
    name: "runtime-env-dev",

    apply(config, { command, mode }) {
      return command === "serve" && mode !== "test";
    },

    configureServer(server: ViteDevServer) {
      const envDir = server.config.envDir || server.config.root;
      const envFiles = getViteEnvFiles(server.config.mode, envDir);
      const watchFiles = [resolve(server.config.root, schemaFile), ...envFiles];
      let hadError = false;

      function run() {
        const validation = validateSchema(
          server.config.root,
          server.config.envPrefix,
        );
        if (!validation.success) {
          logError(
            server.config.logger,
            "Schema validation failed",
            validation.message,
            server,
          );
          hadError = true;
          return;
        }

        if (isTypeScriptProject(server.config.root)) {
          const tsResult = runRuntimeEnvCommand(
            "gen-ts",
            "src/runtime-env.d.ts",
          );
          if (!tsResult.success) {
            logError(
              server.config.logger,
              "Failed to generate runtime-env.d.ts",
              tsResult.stderr || tsResult.stdout,
              server,
            );
            hadError = true;
            return;
          }
        }

        const devOutputDir = getTempDir("dev");
        const devOutputPath = resolve(devOutputDir, "runtime-env.js");
        const jsResult = runRuntimeEnvCommand(
          "gen-js",
          devOutputPath,
          envFiles,
        );

        if (!jsResult.success) {
          logError(
            server.config.logger,
            "Failed to generate runtime-env.js",
            jsResult.stderr || jsResult.stdout,
            server,
          );
          hadError = true;
          return;
        }

        if (hadError) {
          clearLastError();
          server.ws.send({ type: "full-reload" });
          hadError = false;
        }
      }

      run();

      server.middlewares.use((req, res, next) => {
        const base = server.config.base || "/";
        const path = req.url?.split("?")[0];
        const targetPath = (base + "/runtime-env.js").replace(/\/+/g, "/");

        if (path === targetPath) {
          const devOutputDir = getTempDir("dev");
          const devOutputPath = resolve(devOutputDir, "runtime-env.js");
          if (existsSync(devOutputPath)) {
            res.setHeader("Content-Type", "application/javascript");
            res.end(readFileSync(devOutputPath, "utf8"));
            return;
          }
        }
        next();
      });

      server.watcher.add(watchFiles);
      server.watcher.on("change", (file) => {
        if (watchFiles.includes(file)) {
          run();
        }
      });
    },

    transformIndexHtml(html, ctx) {
      if (ctx.server) {
        const envDir = ctx.server.config.envDir || ctx.server.config.root;
        const envFiles = getViteEnvFiles(ctx.server.config.mode, envDir);

        if (!hasRuntimeEnvScript(html, ctx.server.config.base)) {
          logError(
            ctx.server.config.logger,
            `index.html is missing <script src="${ctx.server.config.base === "/" ? "" : ctx.server.config.base}/runtime-env.js"></script>. ` +
              "Runtime values will not be available. Please add the script tag.",
            undefined,
            ctx.server,
          );
        }

        const tmpDir = getTempDir("dev-interpolate");
        try {
          const htmlFile = resolve(tmpDir, "index.html");
          writeFileSync(htmlFile, html, "utf8");
          const result = runRuntimeEnvCommand(
            "interpolate",
            htmlFile,
            envFiles,
            htmlFile,
          );

          if (!result.success) {
            logError(
              ctx.server.config.logger,
              "Failed to interpolate index.html",
              result.stderr || result.stdout,
              ctx.server,
            );
            return html;
          }

          html = readFileSync(htmlFile, "utf8");
          return html;
        } finally {
          rmSync(tmpDir, { recursive: true, force: true });
        }
      }
    },
  };
}
