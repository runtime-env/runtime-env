import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { tmpdir } from "tmp";

const envSchemaFilePath = path.resolve(__dirname, ".runtimeenvschema.json");

describe("integration - gen-ts", () => {
  test("globalVariableName", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-ts", "--global-variable-name", "env"],
      {
        encoding: "utf8",
        stdio: "pipe",
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
        "gen-ts",
        "--env-schema-file-path",
        envSchemaFilePath,
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

  test("envSchemaFilePath - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-ts", "--env-schema-file-path", "invalid"],
      {
        encoding: "utf8",
        stdio: "pipe",
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
        "gen-ts",
        "--output-file-path",
        path.resolve(tmpdir, "runtime-env-gen-ts-output-file-path.ts"),
      ],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
    expect(
      fs.readFileSync(
        path.resolve(tmpdir, "runtime-env-gen-ts-output-file-path.ts"),
        "utf8",
      ),
    ).toMatchSnapshot();
  });
});
