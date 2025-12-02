/// <reference types="cypress" />

describe("development", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
  });

  it("displays environment variable", () => {
    cy.contains("development");
  });
});
