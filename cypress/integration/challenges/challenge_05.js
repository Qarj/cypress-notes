const helper = require('../../helper/helper');

describe('Challenge 05', function () {
    it('runs a test inside a subfolder of integration', function () {
        cy.setBaseUrl('https://www.cwjobs.co.uk');

        helper.example_login();

        const account_url = '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);
    });
});
