import parseConfig from "../src/parse-config";

const minimalValidConfig = {
  globalVariableName: "_",
  genJs: [
    {
      mode: "_",
      envExampleFilePath: "_",
      envFilePath: null,
      userEnvironment: false,
      outputFilePath: "_",
    },
  ],
};

describe("globalVariableName", () => {
  test("valid", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        globalVariableName: "fooBar",
      }),
    ).not.toThrow();
  });

  test("invalid", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        globalVariableName: "foo-bar",
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
