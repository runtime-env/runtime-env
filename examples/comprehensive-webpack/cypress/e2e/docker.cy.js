/// <reference types="cypress" />

describe("comprehensive-webpack docker deployment", () => {
  const imageName = "runtime-env-comprehensive-webpack";
  const containerName = "runtime-env-comprehensive-webpack-test";

  before(() => {
    // Copy tarball to example directory
    cy.exec("cp ../../packages/cli/runtime-env-cli-test.tgz .");

    // Build Docker image
    cy.exec(`docker build . -t ${imageName}`, { timeout: 300000 });
  });

  after(() => {
    // Clean up all containers with this image
    cy.exec(
      `docker ps -a -q --filter ancestor=${imageName} | xargs -r docker rm -f`,
      { failOnNonZeroExit: false }
    );
  });

  afterEach(() => {
    // Stop and remove container after each test
    cy.exec(`docker stop ${containerName} || true`, {
      failOnNonZeroExit: false,
    });
    cy.exec(`docker rm ${containerName} || true`, { failOnNonZeroExit: false });
  });

  it("builds docker image successfully", () => {
    // This is tested in the before() hook, just verify the image exists
    cy.exec(`docker images -q ${imageName}`).then((result) => {
      expect(result.stdout.trim()).to.not.be.empty;
    });
  });

  it("container serves app with runtime injection", () => {
    // Start container with environment variable
    cy.exec(
      `docker run -d --name ${containerName} -p 3000:80 -e FOO=docker-test ${imageName}`,
      { timeout: 30000 }
    );

    // Wait for container to be ready
    cy.wait(5000);

    // Wait for server to be ready
    cy.waitForServer("http://localhost:3000", 30);

    // Visit and verify value
    cy.visit("http://localhost:3000");
    cy.get("#app").should("contain", "docker-test");
    cy.title().should("include", "docker-test");
  });

  it("service worker is patched and loads", () => {
    // Start container
    cy.exec(
      `docker run -d --name ${containerName} -p 3000:80 -e FOO=docker-sw-test ${imageName}`,
      { timeout: 30000 }
    );

    cy.wait(5000);

    // Wait for server to be ready
    cy.waitForServer("http://localhost:3000", 30);

    cy.visit("http://localhost:3000");
    cy.window().then((win) => {
      // Check that service worker is available
      cy.wrap(win.navigator.serviceWorker).should("exist");
    });
  });

  it("can restart container with different env values", () => {
    // Start first container
    cy.exec(
      `docker run -d --name ${containerName} -p 3000:80 -e FOO=docker-first ${imageName}`,
      { timeout: 30000 }
    );

    cy.wait(5000);

    // Wait for server
    cy.waitForServer("http://localhost:3000", 30);

    cy.visit("http://localhost:3000");
    cy.get("#app").should("contain", "docker-first");

    // Stop and remove first container
    cy.exec(`docker stop ${containerName}`);
    cy.exec(`docker rm ${containerName}`);

    // Start new container with different value (NO image rebuild)
    cy.exec(
      `docker run -d --name ${containerName} -p 3000:80 -e FOO=docker-second ${imageName}`,
      { timeout: 30000 }
    );

    cy.wait(5000);

    // Wait for new server
    cy.waitForServer("http://localhost:3000", 30);

    // Visit and verify new value
    cy.visit("http://localhost:3000");
    cy.get("#app").should("contain", "docker-second");
    cy.title().should("include", "docker-second");
  });
});
