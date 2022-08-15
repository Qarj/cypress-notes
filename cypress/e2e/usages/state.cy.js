const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of state commands', () => {
    it('should save the current session state', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        cy.saveState('myLogin');
    });

    it('should restore the session state saved to disk', () => {
        cy.setupExampleWebsite();
        cy.restoreState('myLogin').then(() => {
            cy.visit('/Authenticated/Default.aspx');
            cy.contains(/Example Cypress/);
            cy.contains(/Accept All/).click();
        });
    });

    it('should save the persistent cookies', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        cy.savePersistentCookies('myLogin');
    });

    it('should restore just the persistent cookies saved to disk', () => {
        cy.setupExampleWebsite();
        cy.restorePersistentCookies('myLogin').then(() => {
            // will only be soft logged in, the hard login cookies are not persistent
            cy.visit('/membersarea');
            cy.contains(/job search at a glance/);
            cy.contains(/Accept All/).click();
        });
    });

    it('should should not fail when restoring cookies that do not exist for a safe first run', () => {
        cy.setupExampleWebsite();
        cy.restorePersistentCookies('firstRun');
    });
});
