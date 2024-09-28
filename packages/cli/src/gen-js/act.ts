import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  envFiles: string[];
  schemaFile: string;
  globalVariableName: string;
}) => Promise<{ output: string }>;

const act: Act = async ({ envFiles, globalVariableName, schemaFile }) => {
  const generator = await createGeneratorForJSONSchema({
    envFiles,
    schemaFile,
    globalVariableName,
    userEnvironment: true,
  });

  const output = await generator.generateJs();

  return {
    output,
  };
};

export default act;
