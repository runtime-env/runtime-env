import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { tmpdir } from "tmp";

const schemaFile = path.resolve(__dirname, ".runtimeenvschema.json");

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

  test("schemaFile", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-ts", "--schema-file", schemaFile],
      {
        encoding: "utf8",
        stdio: "pipe",
        cwd: __dirname,
      },
    );
    expect(result.status).toBe(0);
    expect(result.output).toMatchSnapshot();
  });

  test("schemaFile - invalid", () => {
    const result = spawnSync(
      "node",
      ["../bin/runtime-env.js", "gen-ts", "--schema-file", "invalid"],
      {
        encoding: "utf8",
        stdio: "pipe",
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
        "gen-ts",
        "--output-file",
        path.resolve(tmpdir, "runtime-env-gen-ts-output-file.ts"),
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
        path.resolve(tmpdir, "runtime-env-gen-ts-output-file.ts"),
        "utf8",
      ),
    ).toMatchSnapshot();
  });
});
