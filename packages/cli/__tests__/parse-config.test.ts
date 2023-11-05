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

describe("genJs.*.mode", () => {
  test("valid", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            ...minimalValidConfig.genJs[0],
            mode: "foo",
          },
          {
            ...minimalValidConfig.genJs[0],
            mode: "bar",
          },
        ],
      }),
    ).not.toThrow();
  });

  test("invalid", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            ...minimalValidConfig.genJs[0],
            mode: "foo",
          },
          {
            ...minimalValidConfig.genJs[0],
            mode: "foo",
          },
        ],
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
