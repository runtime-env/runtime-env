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

    // Wait for server to be ready
    cy.waitForServer("http://localhost:4173");
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
    cy.waitForServer("http://localhost:4173");

    // Visit page and wait for service worker to be ready
    cy.visit("http://localhost:4173");
    
    // Reload to allow service worker to install new version
    cy.wait(2000);
    cy.reload();
    
    // Second reload to activate the new service worker
    cy.wait(2000);
    cy.reload();
    
    // Verify new value is displayed
    cy.get("#app").should("contain", "preview-updated");
    cy.title().should("include", "preview-updated");
  });
});
