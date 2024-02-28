import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type CreateDeclaration = (_: {
  envSchemaFilePath: string;
  globalVariableName: string;
  input: string;
}) => Promise<{ output: string }>;

const act: CreateDeclaration = async ({
  envSchemaFilePath,
  globalVariableName,
  input,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath: [],
    envSchemaFilePath,
    globalVariableName,
    userEnvironment: true,
  });

  const output = await generator.interpolate(input);

  return {
    output,
  };
};

export default act;
