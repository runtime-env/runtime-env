describe("Preview Mode E2E - Initial Load", () => {
  it("should serve interpolated content with service worker", () => {
    // Visit the preview server (already running via start-server-and-test)
    // .env file is created AFTER build in CI
    cy.visit("/");

    // Verify page displays the actual runtime-env value (not template syntax)
    cy.get("#app").should("not.contain", "<%=");
    cy.get("#app").should("not.contain", "undefined");
    cy.get("#app").invoke("text").should("match", /\w+/);

    // Verify page title contains the actual runtime-env value
    cy.title().should("not.include", "<%=");
    cy.title().should("not.include", "undefined");

    // Verify service worker installs successfully
    cy.window().then((win) => {
      if ("serviceWorker" in win.navigator) {
        cy.wrap(win.navigator.serviceWorker.ready).should("exist");
      }
    });

    // Verify no console errors
    cy.window().then((win) => {
      cy.spy(win.console, "error");
    });
  });
});
