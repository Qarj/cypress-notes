Cypress.Commands.add('createAccountMock', (email) => {
    cy.log(`Pretending to create account ${email}`);
    cy.addEmailToCreatedAccountsList(email);
});

Cypress.Commands.add('closeAccountMock', (email) => {
    cy.log(`Pretending to close the account ${email}`);
});
