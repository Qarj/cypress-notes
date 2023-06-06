const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Wall', () => {
    it('should be no wall', () => {
        cy.setBaseUrl('https://www.totaljobs.com');
        cy.setCookieConsent();
        cy.blockUnwantedRequests();
        cy.visit('/jobs/test', { timeout: 5000 });
        cy.contains('Accept All').should('not.exist');
    });
});
