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

// write integration tests here for gen-js command
describe("integration - gen-js", () => {
  test("globalVariableName", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-js", "--global-variable-name", "env"],
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

  test("envSchemaFilePath", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-schema-file-path",
        envSchemaFilePath,
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

  test("envSchemaFilePath - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-js", "--env-schema-file-path", "invalid"],
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
        "gen-js",
        "--output-file-path",
        path.resolve(tmpdir, "runtime-env-gen-js-output-file-path.js"),
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
        path.resolve(tmpdir, "runtime-env-gen-js-output-file-path.js"),
        "utf8",
      ),
    ).toMatchSnapshot();
  });

  test("requiredEnv", () => {
    const result = spawnSync("node", ["../bin/runtime-env.js", "gen-js"], {
      encoding: "utf8",
      stdio: "pipe",
      env: {
        ...process.env,
        ...requiredEnv,
      },
      cwd: __dirname,
    });
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("requiredEnv - invalid", () => {
    const result = spawnSync("node", ["../bin/runtime-env.js", "gen-js"], {
      encoding: "utf8",
      stdio: "pipe",
      env: {
        ...process.env,
        ...requiredEnvInvalid,
      },
      cwd: __dirname,
    });
    expect(result.status).toBe(1);
  });

  test("optionalEnv", () => {
    const result = spawnSync("node", ["../bin/runtime-env.js", "gen-js"], {
      encoding: "utf8",
      stdio: "pipe",
      env: {
        ...process.env,
        ...optionalEnv,
      },
      cwd: __dirname,
    });
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("optionalEnv - invalid", () => {
    const result = spawnSync("node", ["../bin/runtime-env.js", "gen-js"], {
      encoding: "utf8",
      stdio: "pipe",
      env: {
        ...process.env,
        ...optionalEnvInvalid,
      },
      cwd: __dirname,
    });
    expect(result.status).toBe(1);
  });
});
