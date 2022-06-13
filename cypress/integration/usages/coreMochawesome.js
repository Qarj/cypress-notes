const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of core mochawesome commands', () => {
    it('should log comment in both mochawesome and cypress runner', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.report('Hey there!');
    });

    it('should log headers in mochawesome report', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');
        cy.requestAndReport('/membersarea/api/savedjobs').then((response) => {
            expect(response.headers).to.have.property('content-type');
        });
    });

    // Seems to have started to hang on Ubuntu 20.04 after upgrading from Cypress v8.5.0 to v9.7.0, screenshot is never made
    // it('should include a screenshot in mochawesome report', () => {
    //     cy.setupExampleWebsite();
    //     cy.blockUnwantedRequests();
    //     cy.visit('/account/signin');
    //     cy.reportScreenshot('Screenshot of initial state');
    // });

    // // Uncomment to see the example
    // it('should include a screenshot in mochawesome report on failure', () => {
    //     cy.setupExampleWebsite();
    //     cy.blockUnwantedRequests();
    //     cy.visit('/account/signin');
    //     expect(true).to.be.false;
    // });
});
