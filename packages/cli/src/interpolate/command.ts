import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import { readFileSync } from "fs";

export default () => {
  return new Command("interpolate")
    .option("--input-file-path <inputFilePath>")
    .option("--output-file-path <outputFilePath>")
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
