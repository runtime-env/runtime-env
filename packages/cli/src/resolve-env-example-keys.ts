import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "dotenv";
import throwError from "./throwError";

type ResolveEnvExampleKeys = (_: {
  envExampleFilePath: string;
}) => readonly string[];

const resolveEnvExampleKeys: ResolveEnvExampleKeys = ({
  envExampleFilePath,
}) => {
  envExampleFilePath = resolve(process.cwd(), envExampleFilePath);
  if (existsSync(envExampleFilePath) === false) {
    throwError(`failed to load file: "${envExampleFilePath}"`);
  }
  const content = readFileSync(envExampleFilePath, "utf8");
  const parsed = parse(content);
  const keys = Object.keys(parsed);
  return Object.freeze(keys);
};

export default resolveEnvExampleKeys;
