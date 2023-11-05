import { cosmiconfigSync } from "cosmiconfig";
import parseConfig from "./parse-config";

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
  const config = cosmiconfigSync("runtimeenv").search()?.config;

  return parseConfig(config);
};

export default resolveConfig;
