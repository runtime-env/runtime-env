import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { tmpdir } from "tmp";

const envSchemaFilePath = path.resolve(__dirname, ".runtimeenvschema.json");
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

  test("envFileSchemaPath", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--env-schema-file-path",
        envSchemaFilePath,
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

  test("inputFilePath", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--input-file-path",
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

  test("inputFilePath - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "interpolate", "--input-file-path", "invalid"],
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
  });

  test("outputFilePath", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "interpolate",
        "--output-file-path",
        path.resolve(tmpdir, "runtime-env-interpolate-output-file-path.html"),
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
        path.resolve(tmpdir, "runtime-env-interpolate-output-file-path.html"),
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
  });
});
