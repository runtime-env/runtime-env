describe("Development Mode E2E", () => {
  it("should display runtime-env value and update on HMR", () => {
    // Visit the dev server (already running via start-server-and-test)
    // .env is created by CI with NEXT_PUBLIC_FOO=dev-initial
    cy.visit("/");

    // Verify page displays the actual runtime-env value (not template syntax)
    // We expect both Server and Client components to show the value
    cy.get("main").should("contain", "dev-initial");

    // Verify page title contains the actual runtime-env value
    cy.title().should("include", "dev-initial");

    // Update .env file to trigger HMR
    cy.exec('echo "NEXT_PUBLIC_FOO=dev-updated" > .env');

    // Wait for HMR to process the change
    cy.wait(5000);

    // Verify page automatically updates with the new runtime-env value
    cy.get("main").should("contain", "dev-updated");
    cy.title().should("include", "dev-updated");
  });
});
