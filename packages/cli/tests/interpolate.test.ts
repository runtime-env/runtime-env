import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { tmpdir } from "tmp";

const schemaFile = path.resolve(__dirname, ".runtimeenvschema.json");
const requiredEnv = {
  FOO: "inline",
};
const requiredEnvInvalid = {};
const optionalEnv = {
  FOO: "inline",
  BAR: '{"BAZ":"baz"}',
};
const optionalEnvInvalid = {
  FOO: "inline",
  BAR: "invalid",
};

// write integration tests here for interpolate command
describe("integration - interpolate", () => {
  test("globalVariableName", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--global-variable-name",
        "env",
        "--",
        "123 <%= env.FOO %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("envFileSchema", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--schema-file",
        schemaFile,
        "--",
        "123 <%= runtimeEnv.FOO %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("inputFile", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--input-file",
        path.resolve(__dirname, "input-file.html"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("inputFile - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "interpolate", "--input-file", "invalid"],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(1);
    expect(result.output).toMatchSnapshot();
  });

  test("outputFile", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--output-file",
        path.resolve(tmpdir, "runtime-env-interpolate-output-file.html"),
        "--",
        "123 <%= runtimeEnv.FOO %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
    expect(
      fs.readFileSync(
        path.resolve(tmpdir, "runtime-env-interpolate-output-file.html"),
        "utf8",
      ),
    ).toMatchSnapshot();
  });

  test("requiredEnv", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--",
        "123 <%= runtimeEnv.FOO %> 456\\n 123 <%= runtimeEnv.BAR.BAZ %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("requiredEnv - invalid", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--",
        "123 <%= runtimeEnv.FOO %> 456\\n 123 <%= runtimeEnv.BAR.BAZ %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...requiredEnvInvalid,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(1);
    expect(result.output).toMatchSnapshot();
  });

  test("optionalEnv", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--",
        "123 <%= runtimeEnv.FOO %> 456\\n 123 <%= runtimeEnv.BAR.BAZ %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...optionalEnv,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("optionalEnv - invalid", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--",
        "123 <%= runtimeEnv.FOO %> 456\\n 123 <%= runtimeEnv.BAR.BAZ %> 456",
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          ...optionalEnvInvalid,
        },
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(1);
    expect(result.output).toMatchSnapshot();
  });
});
