const foo = require("../src");

test("runtimeEnv should be loaded", () => {
  expect(foo).toBe("test");
});
