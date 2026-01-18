import { describe, it, expect, expectTypeOf } from "vitest";

describe("Runtime Environment", () => {
  it("should have runtimeEnv defined on globalThis", () => {
    expect(globalThis.runtimeEnv).toBeDefined();
  });

  it("should have VITE_FOO property in runtimeEnv", () => {
    expect(globalThis.runtimeEnv.VITE_FOO).toBeDefined();
  });

  it("should be accessible as a string", () => {
    expect(typeof globalThis.runtimeEnv.VITE_FOO).toBe("string");
  });

  it("should have type-safe access to VITE_FOO", () => {
    expectTypeOf(globalThis.runtimeEnv.VITE_FOO).toBeString();
  });

  it("should not allow access to non-existent properties", () => {
    // @ts-expect-error - BAR does not exist in schema
    const bar = globalThis.runtimeEnv.BAR;
    expect(bar).toBeUndefined();
  });
});
