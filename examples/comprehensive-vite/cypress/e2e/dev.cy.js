/// <reference types="cypress" />

describe("comprehensive-vite dev mode", () => {
  it("displays runtime-env value", () => {
    cy.visit("http://localhost:5173");
    cy.get("#app").should("contain", "dev-test");
    cy.title().should("include", "dev-test");
  });

  it("updates value via HMR when .env changes", () => {
    // Visit page first
    cy.visit("http://localhost:5173");
    cy.get("#app").should("contain", "dev-test");

    // Update .env file
    cy.writeFile(".env", "FOO=dev-updated");

    // Wait for HMR to trigger (polling for the new value)
    cy.get("#app", { timeout: 30000 }).should("contain", "dev-updated");
    cy.title().should("include", "dev-updated");
  });
});
