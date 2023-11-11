import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";
import createMessage from "../create-message";

export default () => {
  return new Command("gen-ts").action(() => {
    const config = resolveConfig();
    if (!config.genTs) throw Error(createMessage("No configuration found"));

    act({
      globalVariableName: config.globalVariableName,
      envExampleFilePath: config.genTs.envExampleFilePath,
      outputFilePath: config.genTs.outputFilePath,
    });
  });
};
