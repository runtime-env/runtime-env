import parseConfig from "../src/parse-config";

const minimalValidConfig = {
  globalVariableName: "_",
  envSchemaFilePath: "_",
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
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
          {
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
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
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
          {
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
        ],
      }),
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
          {
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "bar",
          },
          {
            envFilePath: null,
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
        ],
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
