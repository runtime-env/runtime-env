import { tmpNameSync } from "tmp";
import { createGeneratorForJSONSchema } from "./json-schema";
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

describe("interpolate", () => {
  it("should works (envFileOnly)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, `FOO="<script>"`, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `
{
  "type": "object",
  "properties": {
    "FOO": {
      "type": "string"
    }
  },
  "required": ["FOO"]
}
`,
      "utf8",
    );
    const userEnvironment = false;

    const input = `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
    `.trim();

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(input);

    expect(output).toMatchSnapshot();
  });

  it("should works (userEnvironment)", async () => {
    const envFilePath = null;
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `
{
  "type": "object",
  "properties": {
    "FOO": {
      "type": "string"
    }
  },
  "required": ["FOO"]
}
`,
      "utf8",
    );
    const userEnvironment = true;

    const input = `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
    `.trim();

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(input);

    expect(output).toMatchSnapshot();
  });

  it("should works (nested)", async () => {
    process.env.BAZ = '{"KEY":"<script>"}';
    process.env.FRED = '["<script>"]';
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, `QUX="{"KEY":"<script>"}"`, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `
{
  "type": "object",
  "properties": {
    "BAZ": {
      "type": "object",
      "properties": {
        "KEY": {
          "type": "string"
        }
      },
      "required": ["KEY"]
    },
    "QUX": {
      "type": "object",
      "properties": {
        "KEY": {
          "type": "string"
        }
      },
      "required": ["KEY"]
    },
    "FRED": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "THUD": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["BAZ", "QUX"]
}
`,
      "utf8",
    );
    const userEnvironment = true;

    const input = `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.BAZ.KEY %></div>
    <div><%= runtimeEnv.QUX.KEY %></div>
    <div><%= runtimeEnv.FRED[0] %></div>
    <div><%= runtimeEnv.UNKNOWN %></div>
    <div><%= runtimeEnv.QUX.UNKNOWN %></div>
    <div><%= runtimeEnv.THUD %></div>
    <div><%= runtimeEnv.THUD[0] %></div>
  </body>
</html>
    `.trim();

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(input);

    expect(output).toMatchSnapshot();
    delete process.env.BAZ;
    delete process.env.FRED;
  });

  it("should works (stringified number)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, `FOO="42"`, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `
{
  "type": "object",
  "properties": {
    "FOO": {
      "type": "string"
    }
  },
  "required": ["FOO"]
}
`,
      "utf8",
    );
    const userEnvironment = false;

    const input = `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
    `.trim();

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(input);

    expect(output).toMatchSnapshot();
  });
});

describe("generate js", () => {
  it("should throw 1", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, '{"type":"invalid"}', "utf8");
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
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
    writeFileSync(envSchemaFilePath, '{"type":"object"}', "utf8");
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
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
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw 4", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `{
      "type": "object",
      "properties": {
        "FOO": {
          "type": "number"
        },
        "BAR": {
          "type": "object",
          "properties": {
            "BAZ": {
              "type": "number"
            }
          }
        }
      },
      "required": ["FOO"]
    }`,
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should escape", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, `FOO=<script>\nBAR={"BAZ":"<script>"}`, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should works (envFile + userEnvironment)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, envFileContent, "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
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

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should works (multiple envFile)", async () => {
    const envFilePath1 = tmpNameSync();
    writeFileSync(envFilePath1, 'FOO="default"', "utf8");
    const envFilePath2 = tmpNameSync();
    writeFileSync(envFilePath2, 'FOO="foo"\nBAR="{"BAZ":"baz"}"', "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath: [envFilePath1, envFilePath2],
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should works (userEnvironment only)", async () => {
    const envFilePath = null;
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(envSchemaFilePath, envSchemaFileContent, "utf8");
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should be undefined if no corresponding environment variable presents (primitive)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `{
      "type": "object",
      "properties": {
        "QUX": {
          "type": "string"
        }
      }
    }`,
      "utf8",
    );
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchSnapshot();
  });

  it("should be undefined if no corresponding environment variable presents (non-primitive)", async () => {
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      `{
      "type": "object",
      "properties": {
        "QUX": {
          "type": "object"
        }
      }
    }`,
      "utf8",
    );
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
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

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const ts = await schema.generateTs();

    expect(ts).toMatchSnapshot();
  });
});
