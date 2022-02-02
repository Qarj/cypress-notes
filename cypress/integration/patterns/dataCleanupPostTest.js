context('Create account', () => {
    before(() => {
        cy.resetCreatedAccountsList();
    });

    after(() => {
        cy.closeCreatedAccounts();
    });

    it('should have recommendations in the body in the response - new account', () => {
        const email = `new-acct-test-delete-me@example.com`;
        cy.createAccount(email);
    });
});
