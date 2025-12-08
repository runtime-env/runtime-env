/// <reference types="cypress" />

describe("comprehensive-vite preview mode", () => {
  let serverPid;

  before(() => {
    // Build WITHOUT .env file
    cy.exec("npm run build", { timeout: 120000 });

    // Create .env AFTER build (simulating deployment)
    cy.writeFile(".env", "FOO=preview-initial");

    // Start preview server in background and capture PID
    cy.exec("npm run preview > preview.log 2>&1 & echo $!", {
      timeout: 10000,
    }).then((result) => {
      serverPid = result.stdout.trim();
      cy.log(`Preview server PID: ${serverPid}`);
    });

    // Wait for server to be ready by polling with retries
    let attempts = 0;
    const maxAttempts = 60;
    const checkServer = () => {
      if (attempts >= maxAttempts) {
        throw new Error("Preview server did not start in time");
      }
      attempts++;
      return cy
        .request({
          url: "http://localhost:4173",
          failOnStatusCode: false,
          timeout: 1000,
        })
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
    // Kill the preview server
    if (serverPid) {
      cy.exec(`kill ${serverPid}`, { failOnNonZeroExit: false });
    }
  });

  it("displays interpolated runtime-env value", () => {
    cy.visit("http://localhost:4173");
    cy.get("#app").should("contain", "preview-initial");
    cy.title().should("include", "preview-initial");
  });

  it("service worker loads successfully", () => {
    cy.visit("http://localhost:4173");
    cy.window().then((win) => {
      // Check that service worker is available
      cy.wrap(win.navigator.serviceWorker).should("exist");
    });
  });

  it("can restart with different env values without rebuild", () => {
    // Kill the current preview server
    cy.exec(`kill ${serverPid}`, { failOnNonZeroExit: false });
    cy.wait(2000);

    // Update .env file with new value
    cy.writeFile(".env", "FOO=preview-updated");

    // Start preview server again (NO rebuild)
    cy.exec("npm run preview > preview.log 2>&1 & echo $!", {
      timeout: 10000,
    }).then((result) => {
      serverPid = result.stdout.trim();
      cy.log(`Preview server PID: ${serverPid}`);
    });

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 60;
    const checkServer = () => {
      if (attempts >= maxAttempts) {
        throw new Error("Preview server did not start in time");
      }
      attempts++;
      return cy
        .request({
          url: "http://localhost:4173",
          failOnStatusCode: false,
          timeout: 1000,
        })
        .then((response) => {
          if (response.status !== 200) {
            cy.wait(1000);
            return checkServer();
          }
        });
    };
    checkServer();

    // Visit and verify new value
    cy.visit("http://localhost:4173");
    
    // Wait for page to be fully loaded and service worker to update
    cy.wait(3000);
    
    // Reload to activate new service worker
    cy.reload();
    cy.wait(2000);
    
    // Reload again to get the new content
    cy.reload();
    
    cy.get("#app").should("contain", "preview-updated");
    cy.title().should("include", "preview-updated");
  });
});
