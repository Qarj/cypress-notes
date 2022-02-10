Cypress.Commands.add('resetCreatedAccountsList', () => {
    const content = { createdAccounts: [] };
    cy.writeFile('state/createdAccountsList.json', content, 'utf8');
    cy.report('createdAccountsList.json was reset');
});

Cypress.Commands.add('addEmailToCreatedAccountsList', (email) => {
    cy.readFile('state/createdAccountsList.json', 'utf8').then((content) => {
        content.createdAccounts.push(email);
        cy.writeFile('state/createdAccountsList.json', content, 'utf8');
        cy.report(`Added email ${email} to createdAccountsList.json`);
    });
});

Cypress.Commands.add('closeCreatedAccounts', () => {
    cy.report('Closing accounts listed in createdAccountsList.json');
    cy.readFile('state/createdAccountsList.json', 'utf8').then((content) => {
        content.createdAccounts.forEach(function (email, index) {
            cy.report(`${index + 1} closing account ${email}`);
            cy.closeAccountMock(email);
        });
    });
    cy.report('Closed all accounts listed in createdAccountsList.json');
});
