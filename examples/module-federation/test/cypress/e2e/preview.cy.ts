describe("Module Federation preview", () => {
  it("renders runtime values from runtime-env.js", () => {
    cy.visit("/");
    cy.contains(`HOST: ${Cypress.env("EXPECTED_HOST")}`);
    cy.contains(`Remote: ${Cypress.env("EXPECTED_REMOTE")}`);
  });
});
