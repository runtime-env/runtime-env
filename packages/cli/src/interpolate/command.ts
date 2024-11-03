import { Command, program } from "commander";
import act from "./act";
import { writeFileSync, readFileSync } from "fs";
import throwError from "../throwError";

export default () => {
  return new Command("interpolate")
    .description(
      "perform template interpolation by substituting environment variables",
    )
    .option(
      "--env-file <envFile...>",
      "set environment variables from supplied file (requires Node.js v20.12.0)",
      [],
    )
    .option(
      "--input-file <inputFile>",
      "specify the input file to be loaded instead of being read from stdin",
    )
    .option(
      "--output-file <outputFile>",
      "specify the output file to be written instead of being piped to stdout",
    )
    .action(async ({ inputFile, outputFile, envFile }, { args }) => {
      const { globalVariableName, schemaFile, watch } = program.opts();

      await run();
      if (watch) {
        const chokidar = require("chokidar");
        chokidar
          .watch([schemaFile, ...envFile, ...(inputFile ? [inputFile] : [])])
          .on("change", async () => {
            await run();
          });
      }

      async function run() {
        let input = "";
        if (inputFile) {
          try {
            input = readFileSync(inputFile, "utf8");
          } catch (error) {
            throwError(
              `input file not found: no such file, open '${inputFile}'`,
            );
          }
        } else {
          input = args[0];
        }

        const { output } = await act({
          envFiles: envFile,
          schemaFile,
          globalVariableName,
          input,
        });

        if (outputFile) {
          writeFileSync(outputFile, output, "utf8");
        } else {
          console.log(output);
        }
      }
    });
};
