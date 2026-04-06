describe("Module Federation dev", () => {
  it("renders host value for both host and remote, and updates after .env changes", () => {
    cy.visit("/");
    cy.contains("HOST: host-example");
    cy.contains("Remote: host-example");

    cy.exec('echo "VITE_MESSAGE=host-updated" > ../host/.env');

    cy.request("/runtime-env.js").its("body").should("contain", "host-updated");

    cy.reload();
    cy.contains("HOST: host-updated");
    cy.contains("Remote: host-updated");
  });
});
