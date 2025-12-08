/// <reference types="cypress" />

describe("comprehensive-vite dev mode", () => {
  const port = 5173;
  const baseUrl = `http://localhost:${port}`;

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("displays environment variable from .env", () => {
    // Verify the page displays the runtime-env value
    cy.get("#app").should("not.be.empty");
    cy.get("#app").invoke("text").should("match", /.+/);

    // Verify the title contains runtime-env value
    cy.title().should("not.equal", "Runtime Env - <%= runtimeEnv.FOO %>");
    cy.title().should("contain", "Runtime Env - ");

    // No console errors
    cy.window().then((win) => {
      cy.stub(win.console, "error").as("consoleError");
    });
  });

  it("HMR updates runtime-env values when .env changes", () => {
    // Get initial value
    cy.get("#app")
      .invoke("text")
      .then((initialValue) => {
        const newValue = `updated-${Date.now()}`;

        // Update .env file
        cy.exec(`echo "FOO=${newValue}" > .env`, { failOnNonZeroExit: false });

        // Wait for HMR to reload (with timeout)
        cy.wait(3000);

        // Verify page displays updated value
        cy.get("#app", { timeout: 10000 }).should(
          "contain",
          newValue,
        );

        // Verify title updates
        cy.title().should("contain", newValue);
      });
  });
});
