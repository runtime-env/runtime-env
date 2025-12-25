import type { Plugin, PreviewServer } from "vite";
import { resolve } from "path";
import { readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { runRuntimeEnvCommand, getTempDir, getViteEnvFiles } from "./utils.js";

export function previewPlugin(): Plugin {
  return {
    name: "runtime-env-preview",

    configurePreviewServer(server: PreviewServer) {
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

        const envDir = server.config.envDir || server.config.root;
        const envFiles = getViteEnvFiles(server.config.mode, envDir);

        // Serve runtime-env.js
        if (path === "/runtime-env.js") {
          const tmpDir = getTempDir("preview-gen-js");
          const tmpPath = resolve(tmpDir, "runtime-env.js");
          try {
            runRuntimeEnvCommand("gen-js", tmpPath, envFiles);
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
        if (path === "/" || path === "/index.html") {
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
                tmpHtmlPath,
                envFiles,
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
