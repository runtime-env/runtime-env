/// <reference types="cypress" />

describe("comprehensive-webpack docker deployment", () => {
  const port = 3000;
  const baseUrl = `http://localhost:${port}`;
  const imageName = "runtime-env-comprehensive-webpack";

  before(() => {
    // Build Docker image
    cy.exec(`docker build . -t ${imageName}`, {
      timeout: 120000,
      failOnNonZeroExit: true,
    });
  });

  afterEach(() => {
    // Clean up containers
    cy.exec(
      `docker ps -a -q -f ancestor=${imageName} | xargs -r docker rm -f`,
      { failOnNonZeroExit: false },
    );
  });

  it("serves app with runtime environment injection", () => {
    const testValue = "docker-test";

    // Run container with environment variable
    cy.exec(
      `docker run -d -p ${port}:80 -e FOO=${testValue} ${imageName}`,
      {
        timeout: 30000,
        failOnNonZeroExit: true,
      },
    );

    // Wait for container to be ready
    cy.wait(3000);

    cy.visit(baseUrl);

    // Verify page displays the value from container environment
    cy.get("#app", { timeout: 10000 }).should("contain", testValue);

    // Verify title contains the value
    cy.title().should("contain", testValue);
  });

  it("service worker loads and was patched", () => {
    const testValue = "docker-sw-test";

    // Run container
    cy.exec(
      `docker run -d -p ${port}:80 -e FOO=${testValue} ${imageName}`,
      {
        timeout: 30000,
        failOnNonZeroExit: true,
      },
    );

    cy.wait(3000);

    cy.visit(baseUrl);

    // Verify service worker loads
    cy.window().then((win) => {
      cy.wrap(win.navigator.serviceWorker.ready, { timeout: 10000 }).should(
        "exist",
      );
    });
  });

  it("can be restarted with different env values", () => {
    const firstValue = "docker-first";
    const secondValue = "docker-updated";

    // Run container with first value
    cy.exec(
      `docker run -d -p ${port}:80 -e FOO=${firstValue} ${imageName}`,
      {
        timeout: 30000,
        failOnNonZeroExit: true,
      },
    );

    cy.wait(3000);
    cy.visit(baseUrl);
    cy.get("#app").should("contain", firstValue);

    // Stop and remove container
    cy.exec(
      `docker ps -a -q -f ancestor=${imageName} | xargs -r docker rm -f`,
      { failOnNonZeroExit: false },
    );

    cy.wait(2000);

    // Run new container with different value
    cy.exec(
      `docker run -d -p ${port}:80 -e FOO=${secondValue} ${imageName}`,
      {
        timeout: 30000,
        failOnNonZeroExit: true,
      },
    );

    cy.wait(3000);
    cy.visit(baseUrl);

    // Verify new value is displayed (not cached)
    cy.get("#app", { timeout: 10000 }).should("contain", secondValue);
    cy.get("#app").should("not.contain", firstValue);
  });
});
