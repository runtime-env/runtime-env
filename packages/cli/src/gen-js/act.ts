import { createGeneratorForJSONSchema } from "../create-generator/json-schema";

type Act = (_: {
  envSchemaFilePath: string;
  globalVariableName: string;
}) => Promise<{ output: string }>;

const act: Act = async ({ globalVariableName, envSchemaFilePath }) => {
  const generator = await createGeneratorForJSONSchema({
    envFilePath: [],
    envSchemaFilePath,
    globalVariableName,
    userEnvironment: true,
  });

  const output = await generator.generateJs();

  return {
    output,
  };
};

export default act;
