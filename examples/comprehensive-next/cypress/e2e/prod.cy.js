describe("Production Mode E2E", () => {
  it("should display runtime-env value from environment", () => {
    // Visit the production server
    cy.visit("/");

    // Verify page displays initial value (from .env used during build/start)
    cy.get("main").should("contain", "bar");
    cy.title().should("include", "bar");
  });
});
