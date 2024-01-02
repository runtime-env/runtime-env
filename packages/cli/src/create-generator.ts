export type CreateGeneratorParameter = {
  globalVariableName: string;
  envSchemaFilePath: string;
  envFilePath: null | string | string[];
  userEnvironment: boolean;
};

export type CreateGeneratorReturnType = {
  generateJs: () => Promise<string>;

  generateTs: () => Promise<string>;
};

export type CreateGenerator = (
  _: CreateGeneratorParameter,
) => Promise<CreateGeneratorReturnType>;
