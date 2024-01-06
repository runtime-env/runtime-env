import { writeFileSync } from "fs";
import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type CreateDeclaration = (_: {
  envFilePath: null | string | string[];
  envSchemaFilePath: string;
  globalVariableName: string;
  input: string;
  outputFilePath: null | string;
  userEnvironment: boolean;
}) => void;

const act: CreateDeclaration = async ({
  envFilePath,
  envSchemaFilePath,
  globalVariableName,
  input,
  outputFilePath,
  userEnvironment,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath,
    envSchemaFilePath,
    globalVariableName,
    userEnvironment,
  });

  const content = await generator.interpolate(input);

  if (outputFilePath !== null) {
    writeFileSync(outputFilePath, content, "utf8");
  } else {
    console.log(content);
  }
};

export default act;
