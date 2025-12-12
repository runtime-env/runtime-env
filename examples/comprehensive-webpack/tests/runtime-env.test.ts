import { expectType, type TypeEqual } from "ts-expect";
describe("Runtime Environment", () => {
  it("should have runtimeEnv defined on globalThis", () => {
    expect(globalThis.runtimeEnv).toBeDefined();
  });

  it("should have FOO property in runtimeEnv", () => {
    expect(globalThis.runtimeEnv.FOO).toBeDefined();
  });

  it("should be accessible as a string", () => {
    expect(typeof globalThis.runtimeEnv.FOO).toBe("string");
  });

  it("should have type-safe access to FOO", () => {
    expectType<TypeEqual<typeof globalThis.runtimeEnv.FOO, string>>(true);
  });

  it("should not allow access to non-existent properties", () => {
    // @ts-expect-error - BAR does not exist in schema
    const bar = globalThis.runtimeEnv.BAR;
    expect(bar).toBeUndefined();
  });
});
