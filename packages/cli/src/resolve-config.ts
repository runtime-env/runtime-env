import { cosmiconfigSync } from "cosmiconfig";
import parseConfig from "./parse-config";
import throwError from "./throwError";

type Config = {
  globalVariableName: string;
  genJs: {
    mode: string;
    envExampleFilePath: string;
    envFilePath: null | string;
    userEnvironment: boolean;
    outputFilePath: string;
  }[];
  genTs: null | {
    envExampleFilePath: string;
    outputFilePath: string;
  };
};

type ResolveConfig = () => Config;

const resolveConfig: ResolveConfig = () => {
  const configResult = cosmiconfigSync("runtimeenv").search();

  if (!configResult?.config) {
    throwError("No configuration found");
  }

  return parseConfig(configResult.config);
};

export default resolveConfig;
