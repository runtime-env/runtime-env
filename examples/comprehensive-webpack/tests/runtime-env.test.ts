describe("Runtime Environment", () => {
  it("should have runtimeEnv globally available", () => {
    expect(globalThis.runtimeEnv).toBeDefined();
  });

  it("should have FOO property", () => {
    expect(globalThis.runtimeEnv.FOO).toBeDefined();
  });

  it("should have string value for FOO", () => {
    expect(typeof globalThis.runtimeEnv.FOO).toBe("string");
  });

  it("should load FOO from environment", () => {
    // In test environment, FOO should be set via .env or defaults
    expect(globalThis.runtimeEnv.FOO).toBeTruthy();
  });
});
