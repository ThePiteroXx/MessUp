describe('App', () => {
  beforeEach(() => {
    cy.login('example@example.com', 'example');
  });
  it('should not visible aside component on mobile', () => {
    cy.viewport('iphone-6');
    cy.get('aside').should('not.visible');
  });
  it('should visible aside component on desktop', () => {
    cy.get('aside').should('be.visible');
  });
  it('should enter to edit profile', () => {
    // there should be two buttons, one is in home page only on mobile, sceond is in aside component
    const btnEditProfile = cy.get('a[href*=profile]').first();
    btnEditProfile.click();

    cy.location().should((loc) => {
      expect(loc.href).include('/profile');
    });
  });
});
