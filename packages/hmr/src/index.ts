import fs from "fs";
import childProcess from "child_process";
import { cosmiconfigSync } from "cosmiconfig";
import chalk from "chalk";

type Watch = (options: {
  mode: string;
  env:
    | NodeJS.Process["env"]
    | (() => NodeJS.Process["env"] | Promise<NodeJS.Process["env"]>);
  before?: () => void | Promise<void>;
  after?: () => void | Promise<void>;
}) => void;

export const watch: Watch = async ({ mode, env, before, after }) => {
  const exec = async () => {
    let anyError = false;
    const watchFiles: string[] = [];

    const configResult = cosmiconfigSync("runtimeenv").search();
    if (configResult?.config) {
      watchFiles.push(configResult.filepath);
      watchFiles.push(configResult.config.envSchemaFilePath);
      if (configResult.config.genJs) {
        try {
          const _env = {
            PATH: process.env.PATH,
            ...(typeof env === "function" ? await env() : env),
          };
          childProcess.execSync(`runtime-env gen-js --mode ${mode}`, {
            env: _env,
            stdio: "inherit",
          });
        } catch (e) {
          anyError = true;
          console.error(e);
        }
        const envFilePath = configResult.config.genJs.find(
          (c: { mode: string }) => c.mode === mode,
        )?.envFilePath;
        watchFiles.push(
          ...(Array.isArray(envFilePath)
            ? envFilePath
            : typeof envFilePath === "string"
            ? [envFilePath]
            : []),
        );
      }
      if (configResult.config.genTs) {
        try {
          childProcess.execSync(`runtime-env gen-ts`, { stdio: "inherit" });
        } catch (e) {
          anyError = true;
          console.error(e);
        }
      }
    } else {
      anyError = true;
      throw Error("[@runtime-env/hmr] No configuration found");
    }

    const watchers = watchFiles
      .filter((watchFile) => {
        return fs.existsSync(watchFile);
      })
      .map((watchFile) => {
        return fs.watch(watchFile, {}, async () => {
          watchers.forEach((watcher) => watcher.close());
          await before?.();
          await exec();
          await after?.();
        });
      });

    if (anyError === false) {
      console.log(chalk.green("[@runtime-env/hmr] executed successfully"));
    }
  };
  exec();
};
