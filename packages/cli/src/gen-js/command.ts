import { Command, program } from "commander";
import act from "./act";
import { writeFileSync } from "fs";

export default () => {
  return new Command("gen-js")
    .description(
      "generate a JavaScript file that includes environment variables within an object, making them accessible through the globalThis property",
    )
    .option(
      "--env-file <envFile...>",
      "set environment variables from supplied file (requires Node.js v20.12.0)",
      [],
    )
    .option(
      "--output-file <outputFile>",
      "specify the output file to be written instead of being piped to stdout",
    )
    .action(async ({ outputFile, envFile }) => {
      const { globalVariableName, schemaFile, watch } = program.opts();

      await run();
      if (watch) {
        const chokidar = require("chokidar");
        chokidar.watch([schemaFile, ...envFile]).on("change", async () => {
          await run();
        });
      }

      async function run() {
        const { output } = await act({
          schemaFile,
          globalVariableName,
          envFiles: envFile,
        });

        if (outputFile) {
          writeFileSync(outputFile, output, "utf8");
        } else {
          console.log(output);
        }
      }
    });
};
