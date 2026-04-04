describe("Module Federation dev", () => {
  it("renders host and remote values and updates after .env changes", () => {
    cy.exec('echo "VITE_MESSAGE=host-example" > ../host/.env');
    cy.exec('echo "VITE_MESSAGE=remote-example" > ../remote/.env');

    cy.visit("/");
    cy.contains("HOST: host-example");
    cy.contains("Remote: remote-example");

    cy.exec('echo "VITE_MESSAGE=host-updated" > ../host/.env');
    cy.exec('echo "VITE_MESSAGE=remote-updated" > ../remote/.env');

    cy.reload();
    cy.contains("HOST: host-updated");
    cy.contains("Remote: remote-updated");
  });
});
