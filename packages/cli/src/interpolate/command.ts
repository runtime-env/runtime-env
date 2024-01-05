import { Command } from "commander";
import resolveConfig from "../resolve-config";
import act from "./act";

export default () => {
  return new Command("interpolate").action((_, { args }) => {
    const config = resolveConfig();

    act({
      envFilePath: [],
      envSchemaFilePath: config.envSchemaFilePath,
      globalVariableName: config.globalVariableName,
      input: args[0],
      userEnvironment: true,
    });
  });
};
