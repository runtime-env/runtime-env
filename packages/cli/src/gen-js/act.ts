import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  schemaFile: string;
  globalVariableName: string;
}) => Promise<{ output: string }>;

const act: Act = async ({ globalVariableName, schemaFile }) => {
  const generator = await createGeneratorForJSONSchema({
    envFile: [],
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
