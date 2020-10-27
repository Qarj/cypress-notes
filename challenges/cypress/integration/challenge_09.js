const helper = require('../helper/helper')

describe('CWJobs http Sign In', function () {

    it('Adds consent cookie using helper', function () {

        const brand_url = 'https://www.cwjobs.co.uk';

        helper.example_login(brand_url);
        helper.accept_cookies();

        const account_url = brand_url + '/Authenticated/Default.aspx';

        cy.visit(account_url);

        cy.get('body').contains('This site uses cookies').should('not.exist');

    })
})
