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

Cypress.Commands.add('createAccount', function (email) {
    const url = `/public-api/v1/candidate/account`;
    const password = 'exampleAccount';
    const body = { email, password, rememberMe: true, loginAfterSuccess: true, loginSource: 'Homepage_top-login' };
    cy.report(`About to create ${email}.`);
    // some code to create the account ...
    cy.addEmailToCreatedAccountsListCE(email);
});

Cypress.Commands.add('closeCreatedAccounts', () => {
    cy.report('Closing accounts listed in createdAccountsList.json');
    cy.readFile('state/createdAccountsList.json', 'utf8').then((content) => {
        content.createdAccounts.forEach(function (email, index) {
            cy.report(`${index + 1} closing account ${email}`);
            cy.clearState();
            cy.login(email);
            cy.closeAccount();
        });
    });
    cy.report('Closed all accounts listed in createdAccountsList.json');
});
