const util = require('../../util/util');

describe('Challenge 06', function () {
    it('uses iframe with different super domain - clicks on Apply to jobs inside iframe', function () {
        cy.setBaseUrl('https://www.totaljobs.com');

        util.example_login();
        util.accept_cookies();

        const applications_url = '/Authenticated/MyApplications.aspx#/dashboard/applications';
        cy.visit(applications_url);

        return; // Redirected to a page without an iframe, need to find another example

        // Getting "Whoops, there is no test to run" after the page gets to first refresh on 5.4.0

        cy.wait(4000);

        // On 5.5.0 we get a bit further and even find the iframe - but the content does not load inside
        // this probably does not work since we did not install this package
        // https://www.npmjs.com/package/cypress-iframe
        cy.get('div > iframe').then(($element) => {
            const $body = $element.contents().find('body');

            let iframe = cy.wrap($body);
            iframe.contains('Apply to jobs').click();
        });
    });
});
