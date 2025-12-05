import { tmpNameSync } from "tmp";
import { createGeneratorForJSONSchema } from "./json-schema";
import { writeFileSync } from "fs";

describe("interpolate", () => {
  it("should works (envFileOnly)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='<script>'
    `.trim(),
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
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

    expect(output).toMatchInlineSnapshot(`
     "<!DOCTYPE html>
     <html>
       <body>
         <div>\\u003Cscript\\u003E</div>
       </body>
     </html>"
    `);
  });

  it("should works (userEnvironment)", async () => {
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [],
      schemaFile,
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

    expect(output).toMatchInlineSnapshot(`
     "<!DOCTYPE html>
     <html>
       <body>
         <div>override</div>
       </body>
     </html>"
    `);
    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should works (nested)", async () => {
    process.env.BAZ = '{"KEY":"<script>"}';
    process.env.FRED = '["<script>"]';
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
QUX='{"KEY":"<script>"}'
    `.trim(),
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
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

    expect(output).toMatchInlineSnapshot(`
     "<!DOCTYPE html>
     <html>
       <body>
         <div>\\u003Cscript\\u003E</div>
         <div>\\u003Cscript\\u003E</div>
         <div>\\u003Cscript\\u003E</div>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
       </body>
     </html>"
    `);
    delete process.env.BAZ;
    delete process.env.FRED;
  });

  it("should works (stringified number)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='42'
BAR='1'
    `.trim(),
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
      JSON.stringify({
        type: "object",
        properties: {
          FOO: {
            type: "string",
          },
          BAR: {
            type: "number",
          },
        },
        required: ["FOO", "BAR"],
      }),
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const output = await schema.interpolate(
      `
<!DOCTYPE html>
<html>
  <body>
    <div><%= runtimeEnv.FOO %></div>
    <div><%= runtimeEnv.BAR %></div>
  </body>
</html>
        `.trim(),
    );

    expect(output).toMatchInlineSnapshot(`
     "<!DOCTYPE html>
     <html>
       <body>
         <div>42</div>
         <div>1</div>
       </body>
     </html>"
    `);
  });
});

describe("generate js", () => {
  it("should throw 1", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(schemaFile, JSON.stringify({ type: "invalid" }), "utf8");
    const userEnvironment = true;

    const schema = await createGeneratorForJSONSchema({
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"schema is invalid: data/type must be "object""`,
    );
  });

  it("should throw 2", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(schemaFile, JSON.stringify({ type: "object" }), "utf8");
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"schema is invalid: data/properties must be object"`,
    );
  });

  it("should throw 3", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"env is invalid: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"FOO"},"message":"must have required property 'FOO'"}]"`,
    );
  });

  it("should throw 4", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='escape<'
BAR='{"BAZ":"value"}'
SECRET='****'
    `,
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() => schema.generateJs()).rejects
      .toThrowErrorMatchingInlineSnapshot(`
     "env is invalid: [{"instancePath":"/FOO","schemaPath":"#/properties/FOO/type","keyword":"type","params":{"type":"number"},"message":"must be number"}]
     env is invalid: [{"instancePath":"/BAR/BAZ","schemaPath":"#/properties/BAR/properties/BAZ/type","keyword":"type","params":{"type":"number"},"message":"must be number"}]"
    `);
  });

  it("should throw 5", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
      JSON.stringify({ type: "object", properties: {}, required: "invalid" }),
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"schema is invalid: data/required must be array"`,
    );
  });

  it("should throw 6", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
      JSON.stringify({ type: "object", properties: {}, required: [123] }),
      "utf8",
    );
    const userEnvironment = false;

    const schema = await createGeneratorForJSONSchema({
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });

    await expect(() =>
      schema.generateJs(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"schema is invalid: data/required/0 must be string"`,
    );
  });

  it("should escape", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='<script>'
BAR='{"BAZ":"<script>"}'
      `.trim(),
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "FOO": "\\u003Cscript\\u003E",
       "BAR": {"BAZ":"\\u003Cscript\\u003E"},
     }
     "
    `);
  });

  it("should works (envFile + userEnvironment)", async () => {
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='escape<'
BAR='{"BAZ":"value"}'
SECRET='****'
    `,
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "FOO": "override",
       "BAR": {"BAZ":"value"},
     }
     "
    `);

    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should works (envFile only)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='escape<'
BAR='{"BAZ":"value"}'
SECRET='****'
    `,
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "FOO": "escape\\u003C",
       "BAR": {"BAZ":"value"},
     }
     "
    `);
  });

  it("should works (multiple envFile)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFilePath1 = tmpNameSync();
    writeFileSync(
      envFilePath1,
      `
FOO='default'
      `.trim(),
      "utf8",
    );
    const envFilePath2 = tmpNameSync();
    writeFileSync(
      envFilePath2,
      `
FOO='foo'
BAR='{"BAZ":"baz"}'
      `.trim(),
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFilePath1, envFilePath2],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "FOO": "foo",
       "BAR": {"BAZ":"baz"},
     }
     "
    `);
  });

  it("should works (userEnvironment only)", async () => {
    process.env.FOO = "override";
    process.env.SECRET = "****";
    const globalVariableName = "runtimeEnv";
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "FOO": "override",
       "BAR": undefined,
     }
     "
    `);
    delete process.env.FOO;
    delete process.env.SECRET;
  });

  it("should be undefined if no corresponding environment variable presents (primitive)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "QUX": undefined,
     }
     "
    `);
  });

  it("should be undefined if no corresponding environment variable presents (non-primitive)", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(envFile, "", "utf8");
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const js = await schema.generateJs();

    expect(js).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     globalThis.runtimeEnv = {
       "QUX": undefined,
     }
     "
    `);
  });
});

describe("generate ts", () => {
  it("should works", async () => {
    const globalVariableName = "runtimeEnv";
    const envFile = tmpNameSync();
    writeFileSync(
      envFile,
      `
FOO='escape<'
BAR='{"BAZ":"value"}'
SECRET='****'
    `,
      "utf8",
    );
    const schemaFile = tmpNameSync();
    writeFileSync(
      schemaFile,
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
      envFiles: [envFile],
      schemaFile,
      globalVariableName,
      userEnvironment,
    });
    const ts = await schema.generateTs();

    expect(ts).toMatchInlineSnapshot(`
     "// Generated by '@runtime-env/cli'

     type Primitive = undefined | null | boolean | string | number;

     type DeepReadonly<T> = T extends Primitive
       ? T
       : T extends Array<infer U>
         ? DeepReadonlyArray<U>
         : DeepReadonlyObject<T>;

     type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

     type DeepReadonlyObject<T> = {
       readonly [K in keyof T]: DeepReadonly<T[K]>;
     };

     declare global {
       var runtimeEnv: RuntimeEnv
     }

     export type RuntimeEnv = DeepReadonly<{
     FOO: string
     BAR?: {
     BAZ?: string
     }
     }>
     "
    `);
  });
});
