const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of core commands', () => {
    it('should log comment in both mochawesome and cypress runner', () => {
        cy.report('Hey there!');
    });

    it('should log headers in mochawesome report', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        cy.requestAndReport('/membersarea/api/savedjobs').then((response) => {
            expect(response.headers).to.have.property('content-type');
        });
    });
});
