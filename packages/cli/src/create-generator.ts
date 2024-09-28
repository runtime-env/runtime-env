export type CreateGeneratorParameter = {
  globalVariableName: string;
  schemaFile: string;
  envFile: null | string | string[];
  userEnvironment: boolean;
};

export type CreateGeneratorReturnType = {
  generateJs: () => Promise<string>;

  generateTs: () => Promise<string>;

  interpolate: (input: string) => Promise<string>;
};

export type CreateGenerator = (
  _: CreateGeneratorParameter,
) => Promise<CreateGeneratorReturnType>;
