import fs from "fs";
import { parse } from "dotenv";
import { red } from "picocolors";
import resolveEnvExampleKeys from "./resolve-env-example-keys";
import throwError from "./throwError";

type ResolveEnv = (_: {
  envFilePath: null | string;
  envExampleFilePath: string;
  userEnvironment: boolean;
}) => Record<string, string>;

const resolveEnv: ResolveEnv = ({
  envFilePath,
  envExampleFilePath,
  userEnvironment,
}) => {
  const parsed = (() => {
    const file = envFilePath ? parse(fs.readFileSync(envFilePath, "utf8")) : {};
    const system = userEnvironment ? process.env : {};
    return Object.assign({}, file, system);
  })();

  const envExampleKeys = resolveEnvExampleKeys({
    envExampleFilePath,
  });

  const missingKeys: string[] = [];
  const env = envExampleKeys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(parsed, key) === false) {
      missingKeys.push(key);
    }

    return Object.assign(acc, { [key]: parsed[key] });
  }, {});
  if (missingKeys.length) {
    const parsedEnvExample = parse(fs.readFileSync(envExampleFilePath, "utf8"));
    const missingEnv = missingKeys.map(
      (key) => `${key}=${parsedEnvExample[key]}`,
    );

    const environmentVariablesAreMissing = [
      "",
      `The following variables were defined in ${envExampleFilePath} file but are not defined in the environment:`,
      "",
      "```",
      ...missingEnv,
      "```",
      "",
      `Here's what you can do:`,
      ...(userEnvironment
        ? [`- Set them to environment variables on your system.`]
        : []),
      ...(envFilePath ? [`- Add them to ${envFilePath} file.`] : []),
      `- Remove them from ${envExampleFilePath} file.`,
      "",
    ].join("\n");
    console.error(
      red(`[runtime-env]: Some environment variables are not defined.`),
    );
    console.error(environmentVariablesAreMissing);

    throwError(`Some environment variables are not defined`);
  }

  return Object.freeze(env!);
};

export default resolveEnv;
