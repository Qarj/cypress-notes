const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of core test setup commands', () => {
    it('should set the base url', () => {
        cy.setBaseUrl('https://www.totaljobs.com');
        cy.report("Now it will be possible to visit https://www.totaljobs.com just by typing cy.visit('/')");
        cy.visit('/');
        cy.report('It is also possible to call cy.request with a relative path.');
        cy.request('/').then((response) => {
            expect(response.headers).to.have.property('content-type');
        });
        cy.report(
            'The setBaseUrl command also performs a visit. If you do not do at least one visit cookies will not function correctly with cy.request.',
        );
    });
});
