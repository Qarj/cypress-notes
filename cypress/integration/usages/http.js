const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of http commands', () => {
    it('should get using http', () => {
        cy.setupExampleWebsite();
        cy.httpGet(`/job/0`, 200, 'Lorem ipsum dolor', 'Unexpected error');
    });

    it('should get using http and retry if necessary', () => {
        cy.setupExampleWebsite();
        cy.httpGetRetry(`/job/0`, 200, 'Lorem ipsum dolor', 5, 500);
    });
});
