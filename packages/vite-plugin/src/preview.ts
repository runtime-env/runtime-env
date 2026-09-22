import type { Plugin, PreviewServer } from "vite";
import { resolve } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import {
  runRuntimeEnvCommand,
  createTempDir,
  getViteEnvFiles,
  validateSchema,
  logError,
} from "./utils.js";

export function previewPlugin(): Plugin {
  return {
    name: "runtime-env-preview",

    apply(config, { command }) {
      // preview command also uses 'serve' but it's often better to just let it be
      // and rely on the hook itself if we don't have a specific command.
      // However, to be consistent with others:
      return command === "serve";
    },

    configurePreviewServer(server: PreviewServer) {
      const tempDir = createTempDir();
      const envDir = server.config.envDir || server.config.root;
      const envFiles = getViteEnvFiles(server.config.mode, envDir);

      const validation = validateSchema(
        server.config.root,
        server.config.envPrefix,
      );
      if (!validation.success) {
        logError(
          server.config.logger,
          "Schema validation failed",
          validation.message,
        );
      }

      let runtimeEnvJs: string | undefined;
      if (validation.success) {
        const tmpPath = resolve(tempDir.dir, "runtime-env.js");
        const result = runRuntimeEnvCommand("gen-js", tmpPath, envFiles);
        if (!result.success) {
          logError(
            server.config.logger,
            "Failed to generate runtime-env.js",
            result.stderr || result.stdout,
          );
        } else if (existsSync(tmpPath)) {
          runtimeEnvJs = readFileSync(tmpPath, "utf8");
        }
      }

      let indexHtml: string | undefined;
      const outDir = server.config.build.outDir || "dist";
      const distIndexHtml = resolve(server.config.root, outDir, "index.html");
      if (existsSync(distIndexHtml)) {
        const tmpHtmlPath = resolve(tempDir.dir, "index.html");
        indexHtml = readFileSync(distIndexHtml, "utf8");
        writeFileSync(tmpHtmlPath, indexHtml, "utf8");

        const result = runRuntimeEnvCommand(
          "interpolate",
          tmpHtmlPath,
          envFiles,
          tmpHtmlPath,
        );

        if (!result.success) {
          logError(
            server.config.logger,
            "Failed to interpolate index.html",
            result.stderr || result.stdout,
          );
        } else {
          indexHtml = readFileSync(tmpHtmlPath, "utf8");
        }
      }

      server.middlewares.use((req, res, next) => {
        const base = server.config.base || "/";
        const url = req.url?.split("?")[0] || "";

        // Normalize path to be relative to base
        let path = url;
        if (url.startsWith(base)) {
          path = url.slice(base.length);
        }
        if (!path.startsWith("/")) {
          path = "/" + path;
        }
        path = path.replace(/\/+/g, "/");

        // Serve runtime-env.js
        if (path === "/runtime-env.js" && runtimeEnvJs !== undefined) {
          res.setHeader("Content-Type", "application/javascript");
          res.end(runtimeEnvJs);
          return;
        }

        // Intercept index.html
        if (
          (path === "/" || path === "/index.html") &&
          indexHtml !== undefined
        ) {
          res.setHeader("Content-Type", "text/html");
          res.end(indexHtml);
          return;
        }

        next();
      });
    },
  };
}
