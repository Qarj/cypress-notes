const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of dealing with new tabs', () => {
    it('should remove the _blank attribute from the link', () => {
        // https://glebbahmutov.com/blog/cypress-second-tab/
        cy.setupExampleWebsite();
        cy.setCookie('CONSENTMGR', 'consent:true');
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');

        // Intercept path and return empty json
        cy.intercept(
            {
                method: /GET/,
                url: /jobshub\/api\/v2\/jobs/,
            },
            {},
        ).as('noJobs');

        cy.visit('/membersarea');

        cy.contains('Create a job alert').invoke('removeAttr', 'target').click();
        cy.contains('Welcome back');
    });
});
