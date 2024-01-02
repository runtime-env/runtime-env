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

describe("genJs.*.envFilePath", () => {
  test("valid 1", () => {
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
        ],
      }),
    ).not.toThrow();
  });

  test("valid 2", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            envFilePath: "_",
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
        ],
      }),
    ).not.toThrow();
  });

  test("valid 3", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            envFilePath: ["_", "__"],
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
        ],
      }),
    ).not.toThrow();
  });

  test("invalid 1", () => {
    expect(() =>
      parseConfig({
        ...minimalValidConfig,
        genJs: [
          {
            envFilePath: [],
            userEnvironment: false,
            outputFilePath: "_",
            mode: "foo",
          },
        ],
      }),
    ).toThrowErrorMatchingSnapshot();
  });
});
