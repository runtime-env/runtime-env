describe("Preview Mode E2E", () => {
  it("serves interpolated content and reflects updates on subsequent start", () => {
    // Visit the preview server (already running via start-server-and-test)
    // .env is created by CI
    cy.visit("/");

    // Get expected value from Cypress environment (passed via --env flag in CI)
    const expectedValue = Cypress.env("EXPECTED_FOO");

    // Verify page displays the actual runtime-env value
    cy.get("main").should("contain", expectedValue);

    // Verify page title contains the actual runtime-env value
    cy.title().should("include", expectedValue);
  });
});
