import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import throwError from "../throwError";

export default () => {
  return new Command("gen-ts").action(async () => {
    const config = resolveConfig();
    if (!config.genTs) throwError("No configuration found");

    await act({
      envSchemaFilePath: config.envSchemaFilePath,
      globalVariableName: config.globalVariableName,
      outputFilePath: config.genTs.outputFilePath,
    });
  });
};
