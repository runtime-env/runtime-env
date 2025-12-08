describe("Docker Deployment E2E - Initial Load", () => {
  it("should serve app with runtime injection and patched service worker", () => {
    // Visit the docker container (already running via start-server-and-test on port 3000)
    cy.visit("http://localhost:3000");

    // Verify page displays docker environment value
    cy.get("#app").should("contain", "docker-initial");

    // Verify page title contains docker value
    cy.title().should("include", "docker-initial");

    // Verify service worker loads and was patched correctly
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
