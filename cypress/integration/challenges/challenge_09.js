const helper = require('../../helper/helper');

describe('Challenge 09', function () {
    it('Adds consent cookie using helper', function () {
        cy.setBaseUrl('https://www.cwjobs.co.uk');

        helper.example_login();
        helper.accept_cookies();

        const account_url = '/Authenticated/Default.aspx';

        cy.visit(account_url);

        cy.get('body').contains('This site uses cookies').should('not.exist');
    });
});
