describe("Docker Deployment E2E", () => {
  it("serves app with runtime injection", () => {
    // Visit the docker container (already running via start-server-and-test on port 3000)
    cy.visit("http://localhost:3000");

    // Get expected value from Cypress environment (passed via --env flag in CI)
    const expectedValue = Cypress.env("EXPECTED_FOO");

    // Verify page displays docker environment value
    cy.get("#app").should("contain", expectedValue);

    // Verify page title contains docker value
    cy.title().should("include", expectedValue);
  });
});
