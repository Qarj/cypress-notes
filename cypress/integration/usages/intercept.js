const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of intercept commands', () => {
    it('should block unwanted requests', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.visit('/');
    });
});
