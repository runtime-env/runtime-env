import { writeFileSync } from "fs";
import tmp from "tmp";
import resolveEnvExampleKeys from "../src/resolve-env-example-keys";

describe("resolveEnvExampleKeys", () => {
  test("it should works", () => {
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=\nBAR=");

    const envExampleKeys = resolveEnvExampleKeys({ envExampleFilePath });

    expect(envExampleKeys).toEqual(["FOO", "BAR"]);
  });

  test("resolved env cannot be mutated", () => {
    const envExampleFilePath = tmp.tmpNameSync();
    writeFileSync(envExampleFilePath, "FOO=");

    const envExampleKeys = resolveEnvExampleKeys({ envExampleFilePath });

    expect(() =>
      (envExampleKeys as string[]).push(""),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot add property 1, object is not extensible"`,
    );
    expect(() =>
      (envExampleKeys as string[]).pop(),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot delete property '0' of [object Array]"`,
    );
  });

  test("throw error if .env.example file is not found", () => {
    const envExampleFilePath = tmp.tmpNameSync();

    expect(() => resolveEnvExampleKeys({ envExampleFilePath })).toThrow(
      Error(`[@runtime-env/cli] failed to load file: "${envExampleFilePath}"`),
    );
  });
});
