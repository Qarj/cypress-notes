const helper = require('../../helper/helper');

describe('Challenge 04', function () {
    it('has two test specs requiring login share login code', function () {
        cy.setBaseUrl('https://www.totaljobs.com');

        helper.example_login();

        const account_url = '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);
    });
});
