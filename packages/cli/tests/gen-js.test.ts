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

  test("schemaFile", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-js", "--schema-file", schemaFile],
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

  test("schemaFile - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-js", "--schema-file", "invalid"],
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
        "gen-js",
        "--output-file",
        path.resolve(tmpdir, "runtime-env-gen-js-output-file.js"),
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
        path.resolve(tmpdir, "runtime-env-gen-js-output-file.js"),
        "utf8",
      ),
    ).toMatchSnapshot();
  });

  test("envFile - empty", () => {
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

  test("envFile - required", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-file",
        path.resolve(__dirname, ".env.required"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("envFile - optional", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-file",
        path.resolve(__dirname, ".env.optional"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("envFile - invalid", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-file",
        path.resolve(__dirname, ".env.invalid"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).not.toBe(0);
    expect(result.output[2]).toContain(".env.invalid");
    expect(result.output[2]).toContain("not found");
  });

  test("envFile - multiple + inline", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-file",
        path.resolve(__dirname, ".env.required"),
        "--env-file",
        path.resolve(__dirname, ".env.optional"),
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

  test("envFile - multiple", () => {
    const result = spawnSync(
      "node",
      [
        "../bin/runtime-env.js",
        "gen-js",
        "--env-file",
        path.resolve(__dirname, ".env.required"),
        "--env-file",
        path.resolve(__dirname, ".env.optional"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
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
    expect(result.output).toMatchSnapshot();
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
    expect(result.output).toMatchSnapshot();
  });
});
