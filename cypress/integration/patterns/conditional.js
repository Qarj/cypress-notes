const util = require('../../util/util');
util.reportScreenshotOnFailure();

describe('Conditional', function () {
    it('invokes command assertContainsOrActionIfContains', function () {
        cy.setupExampleWebsite();
        cy.visit('/');

        cy.assertContainsOrActionIfContains('NonExistingText', 'Accept All', function () {
            cy.contains('Accept All').click();
        });

        cy.assertContainsOrActionIfContains('Freedom is finding', 'NonExistingText', function () {
            cy.contains('Search').click();
        });
    });

    it('clicks an element if it finds it consistently', function () {
        cy.setupExampleWebsite();
        cy.visit('/');

        const acceptAllCookies = '[id=ccmgt_explicit_accept]';
        cy.get(acceptAllCookies).click();

        const companiesHiring = '[href="/CompanySearch/CompanyIndex.aspx"]';
        cy.clickLocatorIfConsistentlyPresent(companiesHiring);

        // can run again, no longer present but test will not break
        cy.clickLocatorIfConsistentlyPresent(companiesHiring);
    });
});
