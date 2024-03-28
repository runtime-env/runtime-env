import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  envSchemaFilePath: string;
  globalVariableName: string;
}) => Promise<{ output: string }>;

const act: Act = async ({ globalVariableName, envSchemaFilePath }) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath: null,
    envSchemaFilePath,
    globalVariableName,
    userEnvironment: false,
  });

  const output = await generator.generateTs();

  return { output };
};

export default act;
