import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import throwError from "../throwError";

export default () => {
  return new Command("gen-js")
    .requiredOption("--mode <mode>")
    .action(({ mode }) => {
      const config = resolveConfig();
      const jsConfig = config.genJs.find((jsConfig) => jsConfig.mode === mode);
      if (!jsConfig) throwError(`No configuration found for mode: ${mode}`);

      act({
        globalVariableName: config.globalVariableName,
        envExampleFilePath: config.envExampleFilePath,
        envFilePath: jsConfig.envFilePath,
        userEnvironment: jsConfig.userEnvironment,
        outputFilePath: jsConfig.outputFilePath,
      });
    });
};
