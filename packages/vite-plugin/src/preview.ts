import type { Plugin, PreviewServer } from "vite";
import { resolve } from "path";
import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { Options, optionSchema } from "./types.js";
import { runRuntimeEnvCommand, getTempDir } from "./utils.js";

export function previewPlugin(options: Options): Plugin {
  return {
    name: "runtime-env-preview",

    configurePreviewServer(server: PreviewServer) {
      const { genJs, interpolateIndexHtml } = optionSchema.parse(options);

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
        if (genJs && path === "/runtime-env.js") {
          const tmpDir = getTempDir("preview-gen-js");
          const tmpPath = resolve(tmpDir, "runtime-env.js");
          try {
            runRuntimeEnvCommand("gen-js", options, tmpPath);
            if (existsSync(tmpPath)) {
              const content = readFileSync(tmpPath, "utf8");
              res.setHeader("Content-Type", "application/javascript");
              res.end(content);
              return;
            }
          } finally {
            rmSync(tmpDir, { recursive: true, force: true });
          }
        }

        // Intercept index.html
        if (interpolateIndexHtml && (path === "/" || path === "/index.html")) {
          const outDir = server.config.build.outDir || "dist";
          const distIndexHtml = resolve(
            server.config.root,
            outDir,
            "index.html",
          );
          if (existsSync(distIndexHtml)) {
            const tmpDir = getTempDir("preview-interpolate");
            try {
              const tmpHtmlPath = resolve(tmpDir, "index.html");
              const originalHtml = readFileSync(distIndexHtml, "utf8");
              writeFileSync(tmpHtmlPath, originalHtml, "utf8");

              runRuntimeEnvCommand(
                "interpolate",
                options,
                tmpHtmlPath,
                tmpHtmlPath,
              );

              const interpolatedHtml = readFileSync(tmpHtmlPath, "utf8");
              res.setHeader("Content-Type", "text/html");
              res.end(interpolatedHtml);
              return;
            } finally {
              rmSync(tmpDir, { recursive: true, force: true });
            }
          }
        }

        next();
      });
    },
  };
}
