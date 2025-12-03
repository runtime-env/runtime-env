/// <reference types="cypress" />

describe("production", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("displays environment variable", () => {
    cy.contains("production");
  });
});
