// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for server to be ready
Cypress.Commands.add("waitForServer", (url, maxAttempts = 60) => {
  const checkServerIterative = (attempts = 0) => {
    if (attempts >= maxAttempts) {
      throw new Error(`Server at ${url} did not start in time`);
    }

    return cy
      .request({ url, failOnStatusCode: false, timeout: 1000 })
      .then((response) => {
        if (response.status === 200) {
          return cy.wrap(response);
        } else {
          return cy.wait(1000).then(() => checkServerIterative(attempts + 1));
        }
      });
  };

  return checkServerIterative();
});
