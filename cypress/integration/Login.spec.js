describe('Login page', () => {
  describe('try login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
    it('should not login if inputs are empty', () => {
      cy.findByRole('button', { name: /Log in/i }).click();
      cy.findByRole('button', { name: /Logout/i }).should('not.exist');
    });

    it('should not login if input email is empty', () => {
      cy.findByLabelText(/Password:/i).type('example');
      cy.findByRole('button', { name: /Log in/i }).click();
      cy.findByRole('button', { name: /Logout/i }).should('not.exist');
    });

    it('should not login if input password is empty', () => {
      cy.findByLabelText(/Email address:/i).type('example@example.com');
      cy.findByRole('button', { name: /Log in/i }).click();
      cy.findByRole('button', { name: /Logout/i }).should('not.exist');
    });

    it('should be error if email or password are invalid', () => {
      cy.findByLabelText(/Email address:/i).type('ele@example.com');
      cy.findByLabelText(/Password:/i).type('example22');
      cy.findByRole('button', { name: /Log in/i }).click();
      cy.contains('Check that the password or email you entered is correct.').should('be.visible');
    });
  });

  it('should open forgot passowrd page when click on the link', () => {
    cy.visit('/login');
    cy.findByText(/Forgot password?/i).click();
    cy.contains('Forgot password').should('be.visible');
  });

  it('should login on account and logout', () => {
    cy.login('example@example.com', 'example');
    cy.contains('Logout').should('be.visible');
    cy.contains('Select friend to chating').should('be.visible');

    cy.location().should((loc) => {
      expect(loc.href).include('/');
    });

    cy.findByRole('button', { name: /Logout/i }).click();
    cy.contains('Login').should('be.visible');
  });
});
