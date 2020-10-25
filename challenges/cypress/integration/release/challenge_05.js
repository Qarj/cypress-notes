const login = require('../../helper/example_login')

describe('CWJobs http Sign In', function () {
    it('Signs into CWJobs with http', function () {

        const brand_url = 'https://www.cwjobs.co.uk';

        login.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);

    })
})
