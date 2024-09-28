import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  schemaFile: string;
  globalVariableName: string;
}) => Promise<{ output: string }>;

const act: Act = async ({ globalVariableName, schemaFile }) => {
  const generator = await createGeneratorForJSONSchema({
    envFile: null,
    schemaFile,
    globalVariableName,
    userEnvironment: false,
  });

  const output = await generator.generateTs();

  return { output };
};

export default act;
