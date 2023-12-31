import { writeFileSync } from "fs";
import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  envSchemaFilePath: string;
  globalVariableName: string;
  outputFilePath: string;
}) => Promise<void>;

const act: Act = async ({
  globalVariableName,
  envSchemaFilePath,
  outputFilePath,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath: null,
    envSchemaFilePath,
    globalVariableName,
    userEnvironment: false,
  });

  const content = await generator.generateTs();

  writeFileSync(outputFilePath, content, "utf8");
};

export default act;
