const util = require('../../util/util');
util.reportScreenshotOnFailure();

describe('Screenshot', function () {
    it('screenshot invokes command assertContainsOrActionIfContains', function () {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.screenshot('before');

        cy.assertContainsOrActionIfContains('NonExistingText', 'Accept All', function () {
            cy.contains('Accept All').click();
        });

        cy.assertContainsOrActionIfContains('Jobseeker', 'NonExistingText', function () {
            cy.contains('Search').click();
        });

        cy.screenshot('after');
    });

    it('screenshot clicks an element locator if it finds it consistently', function () {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.screenshot('before');

        const acceptAllCookies = '[id=ccmgt_explicit_accept]';
        cy.get(acceptAllCookies).click();

        const companiesHiring = '[href="/CompanySearch/CompanyIndex.aspx"]';
        cy.clickLocatorIfConsistentlyVisible(companiesHiring);

        // can run again, no longer present but test will not break
        cy.clickLocatorIfConsistentlyVisible(companiesHiring);
    });

    it('screenshot clicks element text if it finds it consistently', function () {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.screenshot('before');

        cy.waitForTextVisibleInElementToStabilise('body').then(() => {
            const visibleText = util.getElementVisibleText('body');
            expect(visibleText).to.contain('Accept All');
        });

        cy.clickTextIfConsistentlyPresent('Accept All').then(() => {
            const visibleText = util.getElementVisibleText('body');
            expect(visibleText).to.not.contain('Accept All');
        });
        cy.screenshot('after');
    });

    it('screenshot finds visible text after waiting for it to stabilise', function () {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.screenshot('before');

        const cookiesModal = '.cc-prompt-modal';
        cy.get(cookiesModal);
        cy.isTextConsistentlyVisibleInElement('We use cookies', cookiesModal);
    });
    cy.screenshot('after');
});
