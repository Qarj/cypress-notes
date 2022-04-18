const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of state commands', () => {
    it('should save the current session state', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        cy.saveState('myLogin');
    });

    it('should restore the session state saved to disk', () => {
        cy.restoreState('myLogin').then(() => {
            cy.visit('/Authenticated/Default.aspx');
            cy.contains(/Example Cypress/);
            cy.contains(/Accept All/).click();
        });
    });

    it.only('should save the persistent cookies', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        cy.savePersistentCookies('myLogin');
    });

    it('should restore just the persistent cookies saved to disk', () => {
        cy.restorePersistentCookies('myLogin').then(() => {
            cy.visit('/Authenticated/Default.aspx');
            cy.contains(/Example Cypress/);
            cy.contains(/Accept All/).click();
        });
    });
});
