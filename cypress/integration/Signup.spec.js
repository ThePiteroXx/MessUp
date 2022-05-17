describe('Signup page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });
  it('should not signup if inputs are empty', () => {
    cy.findByRole('button', { name: /Sign up/i }).click();
    cy.findByRole('button', { name: /Logout/i }).should('not.exist');
  });

  it('should not signup if input email is empty', () => {
    cy.findByLabelText(/Password:/i).type('example');
    cy.findByRole('button', { name: /Sign up/i }).click();
    cy.findByRole('button', { name: /Logout/i }).should('not.exist');
  });

  it('should not signup if input password is empty', () => {
    cy.findByLabelText(/Email address:/i).type('example@example.com');
    cy.findByRole('button', { name: /Sign up/i }).click();
    cy.findByRole('button', { name: /Logout/i }).should('not.exist');
  });

  it('should not signup if input displayname is empty', () => {
    cy.findByLabelText(/Email address:/i).type('example@example.com');
    cy.findByLabelText(/Password:/i).type('example');
    cy.findByRole('button', { name: /Sign up/i }).click();
    cy.findByRole('button', { name: /Logout/i }).should('not.exist');
  });

  it('should display error if one of the inputs have <script> tag', () => {
    cy.findByLabelText(/Email address:/i).type('example@user.com');
    cy.findByLabelText(/Password:/i).type('<script>some</script>');
    cy.findByLabelText(/Display name:/i).type('example');
    cy.findByRole('button', { name: /Sign up/i }).click();
    cy.contains('Please improve your signup form.').should('be.visible');
  });
});
