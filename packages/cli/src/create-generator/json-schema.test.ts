import { tmpNameSync } from "tmp";
import { createGeneratorForJSONSchema } from "./json-schema";
import { writeFileSync } from "fs";

describe("interpolate", () => {
  it("should works (envFileOnly)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="<script>"
    `.trim(),
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(
      `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
      `.trim(),
    );

    expect(output).toMatchSnapshot();
  });

  it("should works (userEnvironment)", async () => {
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const envFilePath = null;
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(
      `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
        `.trim(),
    );

    expect(output).toMatchSnapshot();
    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should works (nested)", async () => {
    process.env.BAZ = '{"KEY":"<script>"}';
    process.env.FRED = '["<script>"]';
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
QUX="{"KEY":"<script>"}"
    `.trim(),
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          BAZ: {
            type: "object",
            properties: {
              KEY: {
                type: "string",
              },
            },
            required: ["KEY"],
          },
          QUX: {
            type: "object",
            properties: {
              KEY: {
                type: "string",
              },
            },
            required: ["KEY"],
          },
          FRED: {
            type: "array",
            items: {
              type: "string",
            },
          },
          THUD: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["BAZ", "QUX"],
      }),
      "utf8",
    );
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(
      `
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
        `.trim(),
    );

    expect(output).toMatchSnapshot();
    delete process.env.BAZ;
    delete process.env.FRED;
  });

  it("should works (stringified number)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="42"
    `.trim(),
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFilePath,
      envSchemaFilePath,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(
      `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
  </body>
</html>
        `.trim(),
    );

    expect(output).toMatchSnapshot();
  });
});

describe("generate js", () => {
  it("should throw 1", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({ type: "invalid" }),
      "utf8",
    );
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
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({ type: "object" }),
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

  it("should throw 3", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
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

  it("should throw 4", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO=escape<
BAR={"BAZ":"value"}
SECRET=****
    `,
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "number",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "number",
              },
            },
          },
        },
        required: ["FOO"],
      }),
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

  it("should throw 5", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({ type: "object", properties: {}, required: "invalid" }),
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

  it("should throw 6", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({ type: "object", properties: {}, required: [123] }),
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
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="<script>"
BAR="{"BAZ":"<script>"}"
      `.trim(),
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
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
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="escape<"
BAR="{"BAZ":"value"}"
SECRET=****
    `,
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
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

    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should works (envFile only)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="escape<"
BAR="{"BAZ":"value"}"
SECRET="****"
    `,
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
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
    const globalVariableName = "runtimeEnv";
    const envFilePath1 = tmpNameSync();
    writeFileSync(
      envFilePath1,
      `
FOO="default"
      `.trim(),
      "utf8",
    );
    const envFilePath2 = tmpNameSync();
    writeFileSync(
      envFilePath2,
      `
FOO="foo"
BAR="{"BAZ":"baz"}"
      `.trim(),
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
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
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const envFilePath = null;
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
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
    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should be undefined if no corresponding environment variable presents (primitive)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          QUX: {
            type: "string",
          },
        },
      }),
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
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(envFilePath, "", "utf8");
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          QUX: {
            type: "object",
          },
        },
      }),
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
    const globalVariableName = "runtimeEnv";
    const envFilePath = tmpNameSync();
    writeFileSync(
      envFilePath,
      `
FOO="escape<"
BAR="{"BAZ":"value"}"
SECRET="****"
    `,
      "utf8",
    );
    const envSchemaFilePath = tmpNameSync();
    writeFileSync(
      envSchemaFilePath,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "object",
            properties: {
              BAZ: {
                type: "string",
              },
            },
          },
        },
        required: ["FOO"],
      }),
      "utf8",
    );
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
