/// <reference types="cypress" />

describe("workbox", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("displays environment variable", () => {
    cy.contains("workbox");
  });
});
