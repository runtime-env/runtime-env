import { writeFileSync } from "fs";
import tmp from "tmp";
import resolveEnv from "../src/resolve-env";

beforeEach(() => {
  delete process.env.FOO;
  delete process.env.BAR;
  delete process.env.BAZ;
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("resolveEnv", () => {
  test("should not load environment variables from env file to system", () => {
    process.env.FOO = "system";
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "FOO=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=");
    const userEnvironment = false;

    resolveEnv({ envExampleFilePath, envFilePath, userEnvironment });

    expect(process.env.FOO).toBe("system");
  });

  test("resolve environment variables from env file only", () => {
    process.env.FOO = "system";
    process.env.BAR = "system";
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "FOO=file\nBAR=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=");
    const userEnvironment = false;

    const env = resolveEnv({
      envExampleFilePath,
      envFilePath,
      userEnvironment,
    });

    expect(env).toEqual({
      FOO: "file",
      BAR: "file",
    });
  });

  test("resolve environment variables from env system only", () => {
    process.env.FOO = "system";
    process.env.BAR = "system";
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=");
    const userEnvironment = true;

    const env = resolveEnv({
      envExampleFilePath,
      envFilePath: null,
      userEnvironment,
    });

    expect(env).toEqual({
      FOO: "system",
      BAR: "system",
    });
  });

  test("resolve environment variables from env file and system", () => {
    process.env.FOO = "system";
    process.env.BAZ = "system";
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "BAR=file\nBAZ=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=\nBAZ=");
    const userEnvironment = true;

    const env = resolveEnv({
      envExampleFilePath,
      envFilePath,
      userEnvironment,
    });

    expect(env).toEqual({
      FOO: "system",
      BAR: "file",
      BAZ: "system",
    });
  });

  test("resolved env cannot be mutate", () => {
    // arrange
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "FOO=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=");
    const userEnvironment = false;

    const env = resolveEnv({
      envExampleFilePath,
      envFilePath,
      userEnvironment,
    });

    expect(() => (env.BAR = "")).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property BAR, object is not extensible"`,
    );
    expect(() => delete env.FOO).toThrowErrorMatchingInlineSnapshot(
      `"Cannot delete property 'FOO' of #<Object>"`,
    );
    expect(() => (env.FOO = "")).toThrowErrorMatchingInlineSnapshot(
      `"Cannot assign to read only property 'FOO' of object '#<Object>'"`,
    );
  });

  test(`throw if any environment variables is not defined (file only)`, () => {
    // arrange
    const spy = jest.spyOn(console, "error").mockImplementation();
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "FOO=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=\nBAZ=\n");
    const userEnvironment = false;

    const act = () =>
      resolveEnv({ envExampleFilePath, envFilePath, userEnvironment });

    expect(act).toThrow(
      Error(`[@runtime-env/cli] Some environment variables are not defined`),
    );
    expect(spy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[31m[runtime-env]: Some environment variables are not defined.[39m",
        ],
        [
          "
      The following variables were defined in ${envExampleFilePath.replace(
        /\\/g,
        "\\\\",
      )} file but are not defined in the environment:

      \`\`\`
      BAR=
      BAZ=
      \`\`\`

      Here's what you can do:
      - Add them to ${envFilePath.replace(/\\/g, "\\\\")} file.
      - Remove them from ${envExampleFilePath.replace(/\\/g, "\\\\")} file.
      ",
        ],
      ]
    `);
  });

  test(`throw if any environment variables is not defined (system only)`, () => {
    // arrange
    process.env.BAR = "system";
    const spy = jest.spyOn(console, "error").mockImplementation();
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=\nBAZ=\n");
    const userEnvironment = true;

    const act = () =>
      resolveEnv({
        envExampleFilePath,
        envFilePath: null,
        userEnvironment,
      });

    expect(act).toThrow(
      Error(`[@runtime-env/cli] Some environment variables are not defined`),
    );
    expect(spy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[31m[runtime-env]: Some environment variables are not defined.[39m",
        ],
        [
          "
      The following variables were defined in ${envExampleFilePath.replace(
        /\\/g,
        "\\\\",
      )} file but are not defined in the environment:

      \`\`\`
      FOO=
      BAZ=
      \`\`\`

      Here's what you can do:
      - Set them to environment variables on your system.
      - Remove them from ${envExampleFilePath.replace(/\\/g, "\\\\")} file.
      ",
        ],
      ]
    `);
  });

  test(`throw if any environment variables is not defined (file and system)`, () => {
    process.env.FOO = "system";
    const spy = jest.spyOn(console, "error").mockImplementation();
    const envFilePath = tmp.tmpNameSync();
    writeFileSync(envFilePath, "BAR=file");
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=\nBAZ=\n");
    const userEnvironment = true;

    const act = () =>
      resolveEnv({ envExampleFilePath, envFilePath, userEnvironment });

    expect(act).toThrow(
      Error(`[@runtime-env/cli] Some environment variables are not defined`),
    );
    expect(spy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[31m[runtime-env]: Some environment variables are not defined.[39m",
        ],
        [
          "
      The following variables were defined in ${envExampleFilePath.replace(
        /\\/g,
        "\\\\",
      )} file but are not defined in the environment:

      \`\`\`
      BAZ=
      \`\`\`

      Here's what you can do:
      - Set them to environment variables on your system.
      - Add them to ${envFilePath.replace(/\\/g, "\\\\")} file.
      - Remove them from ${envExampleFilePath.replace(/\\/g, "\\\\")} file.
      ",
        ],
      ]
    `);
  });
});
