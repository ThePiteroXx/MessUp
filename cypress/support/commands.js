// ***********************************************
// This example commands.js shows you how to
// crate various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
//
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })e
import '@testing-library/cypress/add-commands';
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.findByLabelText(/Email address:/i).type('example@example.com');
  cy.findByLabelText(/Password:/i).type('example');
  cy.findByRole('button', { name: /Log in/i }).click();
});
