const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of cookies commands', () => {
    it('should stash the cookies from one domain and restore them on another', () => {
        cy.blockUnwantedRequests();
        cy.httpGet(`/job/0`, 200, 'Lorem ipsum dolor', 'Unexpected error');
        cy.setCookie('CONSENTMGR', 'consent:true');
        cy.stashCookies('myStash').then((cookies) => {
            cy.setupExampleWebsite();
            cy.setCookiesOnDomain(cookies, 'www.totaljobs.com');
            cy.visit('/job/0');
            // the cookie banner will not show on the new domain
        });
    });

    it('should stash the cookies, clear them, unstash and carry on', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');
        cy.stashCookies('ourStash'); // stash the cookies and clear them
        cy.visit('/Authenticated/Default.aspx').then(() => {
            cy.get('html:root').then((html) => {
                expect(html).to.contain('Jobseeker sign in');
            });
        });
        cy.unstashCookies('ourStash');
        cy.visit('/Authenticated/Default.aspx').then(() => {
            cy.get('html:root').then((html) => {
                expect(html).to.contain('Welcome back');
            });
        });
    });

    it('compares the cookies with the stash', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.loginExample('example_cypress@mailinator.com');
        cy.stashCookies('thisStash');
        cy.unstashCookies('thisStash');
        cy.setCookie('CONSENTMGR', 'consent:true');
        cy.compareCookiesWithStash('thisStash').then((newCookies) => {
            expect(newCookies).to.have.length(1);
            expect(newCookies[0]).to.have.property('name', 'CONSENTMGR');
        });
    });
});
