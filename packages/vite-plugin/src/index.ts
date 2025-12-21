import type { Plugin } from "vite";
import { Options, optionSchema } from "./types.js";
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  copyFileSync,
  existsSync,
  rmSync,
} from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

export default function runtimeEnv(options: Options): Plugin {
  const schemaFile = ".runtimeenvschema.json";
  const globalVariableName = "runtimeEnv";
  const { genTs, genJs, interpolateIndexHtml } = optionSchema.parse(options);

  let isServe = false;
  let isBuild = false;
  let isTest = false;
  let isPreview = false;

  return {
    name: "@runtime-env/vite-plugin",

    config(config, configEnv) {
      isServe = configEnv.command === "serve";
      isBuild = configEnv.command === "build";
      isTest = config.mode === "test";
      isPreview = configEnv.isPreview ?? false;

      if (configEnv.command === "build") {
        if (genTs) {
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "gen-ts",
            "--output-file",
            genTs.outputFile,
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
      }

      if (isPreview) {
        if (genJs) {
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "gen-js",
            ...genJs.envFile.map((file) => ["--env-file", file]).flat(),
            "--output-file",
            resolve("dist", "runtime-env.js"),
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
        if (interpolateIndexHtml) {
          if (existsSync("dist/index.html.backup") === false) {
            copyFileSync("dist/index.html", "dist/index.html.backup");
          }
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "interpolate",
            ...interpolateIndexHtml.envFile
              .map((file) => ["--env-file", file])
              .flat(),
            "--input-file",
            "dist/index.html.backup",
            "--output-file",
            "dist/index.html",
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
      }
    },

    configResolved(config) {
      if (isServe && !isPreview) {
        if (genJs) {
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "gen-js",
            ...genJs.envFile.map((file) => ["--env-file", file]).flat(),
            "--output-file",
            resolve(config.publicDir, "runtime-env.js"),
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
      }

      if (isBuild) {
        if (genJs) {
          rmSync(resolve(config.publicDir, "runtime-env.js"), { force: true });
        }
      }
    },

    transformIndexHtml(html) {
      html = html.replace(
        `</head>`,
        `<script src="/runtime-env.js"></script></head>`,
      );

      if (isBuild) {
        return html;
      }
      if (!interpolateIndexHtml) {
        return html;
      }

      const tmpDir = mkdtempSync("runtime-env-vite-plugin", "utf8");
      const htmlFile = resolve(tmpDir, "index.html");
      writeFileSync(htmlFile, html, "utf8");
      const args = [
        "--schema-file",
        schemaFile,
        "--global-variable-name",
        globalVariableName,
        "interpolate",
        ...interpolateIndexHtml.envFile
          .map((file) => ["--env-file", file])
          .flat(),
        "--input-file",
        htmlFile,
        "--output-file",
        htmlFile,
      ];
      spawnSync("node", [
        resolve("node_modules", ".bin", "runtime-env"),
        ...args,
      ]);
      html = readFileSync(htmlFile, "utf8");
      rmSync(tmpDir, { recursive: true });
      return html;
    },

    configureServer(server) {
      if (isTest) return;

      const watchFiles = [schemaFile];
      if (genJs) {
        watchFiles.push(...genJs.envFile);
      }

      function run() {
        if (genJs) {
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "gen-js",
            ...genJs.envFile.map((file) => ["--env-file", file]).flat(),
            "--output-file",
            resolve(server.config.publicDir, "runtime-env.js"),
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
        if (genTs) {
          const args = [
            "--schema-file",
            schemaFile,
            "--global-variable-name",
            globalVariableName,
            "gen-ts",
            "--output-file",
            genTs.outputFile,
          ];
          spawnSync("node", [
            resolve("node_modules", ".bin", "runtime-env"),
            ...args,
          ]);
        }
      }

      run();
      server.watcher.add(watchFiles);
      server.watcher.on("change", (file) => {
        if (watchFiles.includes(file)) {
          run();
        }
      });
    },
  };
}
