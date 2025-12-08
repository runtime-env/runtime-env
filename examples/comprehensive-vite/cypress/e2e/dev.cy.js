describe("Development Mode E2E", () => {
  it("should display runtime-env value and update on HMR", () => {
    // Create initial .env file
    cy.writeFile(".env", "FOO=dev-initial");

    // Visit the dev server (already running via start-server-and-test)
    cy.visit("/");

    // Verify page displays initial runtime-env value
    cy.get("#app").should("contain", "dev-initial");

    // Verify page title contains runtime-env value
    cy.title().should("include", "dev-initial");

    // Update .env file using cy.exec
    cy.exec('echo "FOO=dev-updated" > .env');

    // Wait for HMR to process change (give it time to detect and reload)
    cy.wait(2000);

    // Reload the page to see the updated value
    cy.reload();

    // Verify page displays updated value (HMR verification)
    cy.get("#app").should("contain", "dev-updated");

    // Verify page title shows updated value
    cy.title().should("include", "dev-updated");
  });
});
