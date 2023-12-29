import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import throwError from "../throwError";

export default () => {
  return new Command("gen-ts").action(() => {
    const config = resolveConfig();
    if (!config.genTs) throwError("No configuration found");

    act({
      globalVariableName: config.globalVariableName,
      envExampleFilePath: config.envExampleFilePath,
      outputFilePath: config.genTs.outputFilePath,
    });
  });
};
