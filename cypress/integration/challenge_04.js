const helper = require('../helper/helper');

describe('Two test specs requiring login share login code', function () {
    it('Signs into Totaljobs with http', function () {

        const brand_url = 'https://www.totaljobs.com';

        helper.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);

    })
})
