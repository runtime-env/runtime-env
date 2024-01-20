import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import { readFileSync } from "fs";

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
      "specify the output file to be written instead of being piped to stdout.",
    )
    .action(({ inputFilePath, outputFilePath }, { args }) => {
      const config = resolveConfig();

      act({
        envFilePath: [],
        envSchemaFilePath: config.envSchemaFilePath,
        globalVariableName: config.globalVariableName,
        input:
          typeof inputFilePath === "string"
            ? readFileSync(inputFilePath, "utf8")
            : args[0],
        outputFilePath:
          typeof outputFilePath === "string" ? outputFilePath : null,
        userEnvironment: true,
      });
    });
};
