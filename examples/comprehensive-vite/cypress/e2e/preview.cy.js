/// <reference types="cypress" />

describe("comprehensive-vite preview mode", () => {
  const port = 4173;
  const baseUrl = `http://localhost:${port}`;

  it("serves interpolated content with runtime-env values", () => {
    cy.visit(baseUrl);

    // Verify page displays actual runtime-env value (not template syntax)
    cy.get("#app").should("not.be.empty");
    cy.get("#app").invoke("text").should("not.contain", "runtimeEnv");
    cy.get("#app").invoke("text").should("match", /.+/);

    // Verify title contains actual value (not template)
    cy.title().should("not.contain", "<%=");
    cy.title().should("contain", "Runtime Env - ");

    // Verify service worker loads
    cy.window().then((win) => {
      cy.wrap(win.navigator.serviceWorker.ready).should("exist");
    });
  });

  it("can be rerun with different env values", () => {
    cy.visit(baseUrl);

    // Get initial value
    cy.get("#app")
      .invoke("text")
      .then((initialValue) => {
        const newValue = `preview-updated-${Date.now()}`;

        // Update .env file
        cy.exec(`echo "FOO=${newValue}" > .env`, { failOnNonZeroExit: false });

        // Rerun preview preparation scripts
        cy.exec("npm run preview:runtime-env:gen-js", {
          failOnNonZeroExit: true,
        });
        cy.exec("npm run preview:runtime-env:interpolate", {
          failOnNonZeroExit: true,
        });
        cy.exec("npm run preview:runtime-env:pwa", { failOnNonZeroExit: true });

        // Wait for server to reflect changes (reload the page)
        cy.wait(2000);

        // Reload page once (service worker installs new files)
        cy.reload();
        cy.wait(2000);

        // Reload page again (service worker activates new files)
        cy.reload();

        // Verify page displays new value
        cy.get("#app", { timeout: 10000 }).should("contain", newValue);

        // Verify title contains new value
        cy.title().should("contain", newValue);
      });
  });
});
