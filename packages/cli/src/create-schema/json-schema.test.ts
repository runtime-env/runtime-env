import { tmpNameSync } from "tmp";
import { createSchemaForJSONSchema } from "./json-schema";
import { writeFileSync } from "fs";

const globalVariableName = "runtimeEnv";
const envFileContent = `
FOO=escape<
BAR={"BAZ":"value"}
SECRET=****
`;
const envSchemaFileContent = `
{
  "type": "object",
  "properties": {
    "FOO": {
      "type": "string"
    },
    "BAR": {
      "type": "object",
      "properties": {
        "BAZ": {
          "type": "string"
        }
      }
    }
  },
  "required": ["FOO"]
}
`;

beforeAll(() => {
  process.env.FOO = "override";
  process.env.SECRET = "****";
});

describe("generate js", () => {
  it("should throw 1", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, '{"type":"invalid"}', "utf8");
    const userEnvironment = true;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw 2", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw 3", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, '{"type":"object"}', "utf8");
    const userEnvironment = false;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should works (envFile + userEnvironment)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = true;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should works (envFile only)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should works (userEnvironment only)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = true;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });
});

describe("generate ts", () => {
  it("should works", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createSchemaForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const ts = await schema.generateTs();

    expect(ts).toMatchSnapshot();
  });
});
