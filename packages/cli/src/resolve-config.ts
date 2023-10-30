import { cosmiconfigSync } from "cosmiconfig";
import { z } from "zod";

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

  const configSchema = z.object({
    globalVariableName: z.string(),
    genJs: z.array(
      z.object({
        mode: z.string(),
        envExampleFilePath: z.string(),
        envFilePath: z.string().nullable().optional().default(null),
        userEnvironment: z.boolean(),
        outputFilePath: z.string(),
      }),
    ),
    genTs: z
      .object({
        envExampleFilePath: z.string(),
        outputFilePath: z.string(),
      })
      .nullable()
      .optional()
      .default(null),
  });

  return configSchema.parse(config);
};

export default resolveConfig;
