/// <reference types="cypress" />

describe("comprehensive-vite preview mode", () => {
  it("displays interpolated runtime-env value", () => {
    cy.visit("http://localhost:4173");
    cy.get("#app").should("contain", "preview-test");
    cy.title().should("include", "preview-test");
  });

  it("service worker loads successfully", () => {
    cy.visit("http://localhost:4173");
    cy.window().then((win) => {
      // Check that service worker is available
      cy.wrap(win.navigator.serviceWorker).should("exist");
    });
  });
});
