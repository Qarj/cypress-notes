const util = require('../../util/util');
util.reportScreenshotOnFailure();

describe('Usage examples of core mochawesome commands', function () {
    it('should log comment in both mochawesome and cypress runner', function () {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.report('Hey there!');
    });

    it('should log headers in mochawesome report', function () {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');
        cy.requestAndReport('/membersarea/api/savedjobs').then((response) => {
            expect(response.headers).to.have.property('content-type');
        });
    });

    // Note that if you reportScreenshot then the test fails, you only get the reportScreenshotOnFailure screenshot

    // Seems to have started to hang on Ubuntu 20.04 after upgrading from Cypress v8.5.0 to v9.7.0, screenshot is never made

    // Giving up for now trying to get this to run on GitHub Actions, error spam on Electron, hangs on Chrome

    it('should include a screenshot in mochawesome report', function () {
        cy.report('Running screenshot test');
        cy.setupExampleWebsite();
        cy.visit('/job/0');
        cy.reportScreenshot('Screenshot of initial state', { capture: 'viewport' });
    });

    it('2 should include a screenshot in mochawesome report', function () {
        cy.report('Running screenshot test');
        cy.setupExampleWebsite();
        cy.visit('/job/0');
        cy.reportScreenshot('Screenshot of initial state', { capture: 'viewport' });
    });

    it('3 should include a screenshot in mochawesome report', function () {
        cy.report('Running screenshot test');
        cy.setupExampleWebsite();
        cy.visit('/job/0');
        cy.reportScreenshot('Screenshot of initial state', { capture: 'viewport' });
    });

    it('4 should include a screenshot in mochawesome report', function () {
        cy.report('Running screenshot test');
        cy.setupExampleWebsite();
        cy.visit('/job/0');
        cy.reportScreenshot('Screenshot of initial state', { capture: 'viewport' });
    });

    // // Uncomment to see the example
    // it('should include a screenshot in mochawesome report on failure', function () {
    //     cy.setupExampleWebsite();
    //     cy.blockUnwantedRequests();
    //     cy.visit('/account/signin');
    //     expect(true).to.be.false;
    // });
});
