const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Read environment variable', () => {
    it('should read the CYPRESS_VISITOR_ID environment variable', () => {
        const VISITOR_ID = Cypress.env('VISITOR_ID');
        cy.log(`This is the VISITOR_ID: ${VISITOR_ID}`);
    });
});
