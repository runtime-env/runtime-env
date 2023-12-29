import { writeFileSync } from "fs";
import { createSchemaForJSONSchema } from "../create-schema/json-schema";

type CreateDeclaration = (_: {
  envFilePath: null | string;
  envSchemaFilePath: string;
  globalVariableName: string;
  outputFilePath: string;
  userEnvironment: boolean;
}) => Promise<void>;

const act: CreateDeclaration = async ({
  globalVariableName,
  envSchemaFilePath,
  envFilePath,
  userEnvironment,
  outputFilePath,
}) => {
  const schema = await createSchemaForJSONSchema({
    envFilePath,
    envSchemaFilePath: envSchemaFilePath,
    globalVariableName,
    userEnvironment,
  });

  const content = await schema.generateJs();

  writeFileSync(outputFilePath, content, "utf8");
};

export default act;
