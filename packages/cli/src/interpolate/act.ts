import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type CreateDeclaration = (_: {
  envFiles: string[];
  schemaFile: string;
  globalVariableName: string;
  input: string;
}) => Promise<{ output: string }>;

const act: CreateDeclaration = async ({
  envFiles,
  schemaFile,
  globalVariableName,
  input,
}) => {
  const generator = await createGeneratorForJSONSchema({
    envFiles,
    schemaFile,
    globalVariableName,
    userEnvironment: true,
  });

  const output = await generator.interpolate(input);

  return {
    output,
  };
};

export default act;
