context('Create account', () => {
    before(() => {
        cy.resetCreatedAccountsList();
    });

    after(() => {
        cy.closeCreatedAccounts();
    });

    it('should have recommendations in the body in the response - new account', () => {
        cy.createAccountMock('delete-me-1@email.com');
        cy.createAccountMock('delete-me-2@email.com');
        cy.createAccountMock('delete-me-3@email.com');
    });
});
