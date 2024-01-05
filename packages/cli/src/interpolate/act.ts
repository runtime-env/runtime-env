import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type CreateDeclaration = (_: {
  envFilePath: null | string | string[];
  envSchemaFilePath: string;
  globalVariableName: string;
  input: string;
  userEnvironment: boolean;
}) => void;

const act: CreateDeclaration = async ({
  envFilePath,
  envSchemaFilePath,
  globalVariableName,
  input,
  userEnvironment,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath,
    envSchemaFilePath,
    globalVariableName,
    userEnvironment,
  });

  const content = await generator.interpolate(input);

  console.log(content);
};

export default act;
