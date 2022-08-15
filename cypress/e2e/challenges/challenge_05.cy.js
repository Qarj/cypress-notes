const util = require('../../util/util');

describe('Challenge 05', function () {
    it('runs a test inside a subfolder of integration', function () {
        cy.setBaseUrl('https://www.cwjobs.co.uk');

        util.example_login();

        const account_url = '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);
    });
});
