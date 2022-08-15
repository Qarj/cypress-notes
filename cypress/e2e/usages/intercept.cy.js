const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of intercept commands', () => {
    it('should block unwanted requests', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.visit('/');
    });

    it('should not go nuts with analytics logging attempts', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');
        cy.visit('/membersarea');
        // The key is:  blockPath('analytics-library.js');
        // Stops massive spam of [913925:0418/170601.039746:INFO:CONSOLE(3)] "Tealium still not available 5 events in Queue,[object Object],[object Object],[object Object],[object Object],[object Object]", source: https://www.totaljobs.com/analytics/analytics-library.js (3)
    });

    it('should be able to intercept based on postbody contents regardless of the order the requests are made', () => {
        cy.setupExampleWebsite();
        cy.loginExample('example_cypress@mailinator.com');
        Cypress.config('intercepts', []);
        cy.intercept('i.gif').as('analytics');
        cy.visit('/membersarea');
        cy.getInterceptWithPostBodyContainingString('@analytics', 'MembersAreaView').then((intercept) => {
            const requestBody = JSON.stringify(intercept.request.body);
            expect(requestBody).to.contain('HomepageMembersArea');
        });
        cy.getInterceptWithPostBodyContainingString('@analytics', 'ApplicationsView').then((intercept) => {
            const requestBody = JSON.stringify(intercept.request.body);
            expect(requestBody).to.contain('HomepageMembersArea');
        });
        cy.getInterceptWithPostBodyContainingString('@analytics', 'SavedJobs').then((intercept) => {
            const requestBody = JSON.stringify(intercept.request.body);
            expect(requestBody).to.contain('HomepageMembersArea');
        });
    });
});
