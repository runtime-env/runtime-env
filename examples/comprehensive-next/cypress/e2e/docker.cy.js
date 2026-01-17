describe("Docker Deployment E2E", () => {
  it("serves app with runtime injection and reflects updates on subsequent container start", () => {
    // Visit the docker container (already running via start-server-and-test)
    cy.visit("/");

    // Get expected value from Cypress environment (passed via --env flag in CI)
    const expectedValue = Cypress.env("EXPECTED_FOO");

    // Verify page displays the actual runtime-env value
    cy.get("main").should("contain", expectedValue);

    // Verify page title contains the actual runtime-env value
    cy.title().should("include", expectedValue);
  });
});
