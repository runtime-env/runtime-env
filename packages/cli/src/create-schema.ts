export type CreateSchemaParameter = {
  globalVariableName: string;
  envSchemaFilePath: string;
  envFilePath: null | string;
  userEnvironment: boolean;
};

export type CreateSchemaReturnType = {
  generateJs: () => Promise<string>;

  generateTs: () => Promise<string>;
};

export type CreateSchema = (
  _: CreateSchemaParameter,
) => Promise<CreateSchemaReturnType>;
