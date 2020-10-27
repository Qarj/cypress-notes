const helper = require('../helper/helper');

describe('Access iframe with different super domain', function () {
    it('Clicks on Apply to jobs inside iframe', function () {

        const brand_url = 'https://www.totaljobs.com';

        helper.example_login(brand_url);
        helper.accept_cookies();

        const applications_url = brand_url + '/Authenticated/MyApplications.aspx#/dashboard/applications';
        cy.visit(applications_url);

        // Getting "Whoops, there is no test to run" after the page gets to first refresh on 5.4.0

        cy.wait(15000);

        // On 5.5.0 we get a bit further and even find the iframe - but the content does not load inside

        cy.get('div > iframe').then($element => {

            const $body = $element.contents().find('body');

            let stripe = cy.wrap($body);
            stripe.contains('Apply to jobs').click();
        })

    })
})
