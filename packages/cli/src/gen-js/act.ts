import { writeFileSync } from "fs";
import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  envFilePath: null | string | string[];
  envSchemaFilePath: string;
  globalVariableName: string;
  outputFilePath: string;
  userEnvironment: boolean;
}) => Promise<void>;

const act: Act = async ({
  globalVariableName,
  envSchemaFilePath,
  envFilePath,
  userEnvironment,
  outputFilePath,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath,
    envSchemaFilePath,
    globalVariableName,
    userEnvironment,
  });

  const content = await generator.generateJs();

  writeFileSync(outputFilePath, content, "utf8");
};

export default act;
