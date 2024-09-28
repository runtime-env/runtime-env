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
      "--input-file-path <inputFilePath>",
      "specify the input file to be loaded instead of being read from stdin",
    )
    .option(
      "--output-file-path <outputFilePath>",
      "specify the output file to be written instead of being piped to stdout",
    )
    .action(async ({ inputFilePath, outputFilePath }, { args }) => {
      const { globalVariableName, envSchemaFilePath } = program.opts();

      let input = "";
      if (inputFilePath) {
        try {
          input = readFileSync(inputFilePath, "utf8");
        } catch (error) {
          throwError(
            `input file not found: no such file, open '${inputFilePath}'`,
          );
        }
      } else {
        input = args[0];
      }
      const { output } = await act({
        envSchemaFilePath,
        globalVariableName,
        input,
      });

      if (outputFilePath) {
        writeFileSync(outputFilePath, output, "utf8");
      } else {
        console.log(output);
      }
    });
};
