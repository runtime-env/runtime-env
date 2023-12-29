import { writeFileSync } from "fs";
import { createSchemaForJSONSchema } from "../create-schema/json-schema";

type CreateDeclaration = (_: {
  envSchemaFilePath: string;
  globalVariableName: string;
  outputFilePath: string;
}) => Promise<void>;

const act: CreateDeclaration = async ({
  globalVariableName,
  envSchemaFilePath,
  outputFilePath,
}) => {
  const schema = await createSchemaForJSONSchema({
    envFilePath: null,
    envSchemaFilePath: envSchemaFilePath,
    globalVariableName,
    userEnvironment: false,
  });

  const content = await schema.generateTs();

  writeFileSync(outputFilePath, content, "utf8");
};

export default act;
