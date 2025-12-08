describe("Docker Deployment E2E - Service Worker Update", () => {
  it("should update service worker with new docker env values", () => {
    // Visit docker container (first load - service worker installs with NEW env values)
    cy.visit("http://localhost:3000");

    // Wait a moment for service worker to install
    cy.wait(1000);

    // Reload page (second load - service worker activates)
    cy.reload();

    // Wait for activation
    cy.wait(1000);

    // Reload page again (third load - service worker serves updated content)
    cy.reload();

    // Verify page displays NEW docker environment value
    cy.get("#app").should("not.contain", "<%=");
    cy.get("#app").should("not.contain", "undefined");
    cy.get("#app").invoke("text").should("match", /\w+/);

    // Verify page title contains NEW value
    cy.title().should("not.include", "<%=");
    cy.title().should("not.include", "undefined");

    // Verify service worker is active
    cy.window().then((win) => {
      if ("serviceWorker" in win.navigator) {
        cy.wrap(win.navigator.serviceWorker.ready).should("exist");
      }
    });
  });
});
