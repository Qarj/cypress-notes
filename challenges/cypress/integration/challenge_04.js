const example_login = require("../helper/example_login")

const login = require('../helper/example_login')

describe('Totaljobs http Sign In', function () {
    it('Signs into Totaljobs with http', function () {

        const brand_url = 'https://www.totaljobs.com';

        login.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);

    })
})
