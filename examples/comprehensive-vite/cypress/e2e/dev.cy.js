/// <reference types="cypress" />

describe("comprehensive-vite dev mode", () => {
  let serverPid;

  before(() => {
    // Create initial .env file
    cy.writeFile(".env", "FOO=dev-initial");

    // Start dev server in background and capture PID
    cy.exec("npm run dev > dev.log 2>&1 & echo $!", { timeout: 10000 }).then(
      (result) => {
        serverPid = result.stdout.trim();
        cy.log(`Dev server PID: ${serverPid}`);
      }
    );

    // Wait for server to be ready by polling with retries
    let attempts = 0;
    const maxAttempts = 60;
    const checkServer = () => {
      if (attempts >= maxAttempts) {
        throw new Error("Dev server did not start in time");
      }
      attempts++;
      return cy
        .request({ url: "http://localhost:5173", failOnStatusCode: false, timeout: 1000 })
        .then((response) => {
          if (response.status !== 200) {
            cy.wait(1000);
            return checkServer();
          }
        });
    };
    checkServer();
  });

  after(() => {
    // Kill the dev server
    if (serverPid) {
      cy.exec(`kill ${serverPid}`, { failOnNonZeroExit: false });
    }
  });

  it("displays initial runtime-env value", () => {
    cy.visit("http://localhost:5173");
    cy.get("#app").should("contain", "dev-initial");
    cy.title().should("include", "dev-initial");
  });

  it("updates value via HMR when .env changes", () => {
    // Visit page first
    cy.visit("http://localhost:5173");
    cy.get("#app").should("contain", "dev-initial");

    // Update .env file
    cy.writeFile(".env", "FOO=dev-updated");

    // Wait for HMR to trigger (polling for the new value)
    cy.get("#app", { timeout: 30000 }).should("contain", "dev-updated");
    cy.title().should("include", "dev-updated");
  });
});
