describe("Module Federation preview", () => {
  it("renders runtime values from runtime-env.js", () => {
    cy.visit("/");
    cy.contains(`HOST: ${cy.env("EXPECTED_HOST")}`);
    cy.contains(`Remote: ${cy.env("EXPECTED_REMOTE")}`);
  });
});
