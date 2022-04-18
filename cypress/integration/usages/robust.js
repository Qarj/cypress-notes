const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of state commands', () => {
    it('should save the persistent cookies', () => {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.getElementConsistently('[id="ccmgt_explicit_accept"]').first().click();
    });
});
