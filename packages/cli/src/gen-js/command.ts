import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import throwError from "../throwError";

export default () => {
  return new Command("gen-js")
    .requiredOption("--mode <mode>")
    .action(async ({ mode }) => {
      const config = resolveConfig();
      if (!config.genJs) throwError("No configuration found");

      const jsConfig = config.genJs.find((jsConfig) => jsConfig.mode === mode);
      if (!jsConfig) throwError(`No configuration found for mode: ${mode}`);

      await act({
        envFilePath: jsConfig.envFilePath,
        envSchemaFilePath: config.envSchemaFilePath,
        globalVariableName: config.globalVariableName,
        outputFilePath: jsConfig.outputFilePath,
        userEnvironment: jsConfig.userEnvironment,
      });
    });
};
