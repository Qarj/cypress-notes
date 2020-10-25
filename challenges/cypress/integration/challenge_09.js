const login = require('../helper/example_login')

describe('CWJobs http Sign In', function () {
    it('Automatically adds consent cookie', function () {

        const CONSENTMGR = 'c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1603662984214%7Cconsent:true';

        const brand_url = 'https://www.cwjobs.co.uk';

        login.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';

        cy.setCookie('CONSENTMGR', CONSENTMGR);
        cy.visit(account_url);

        cy.get('body').contains('This site uses cookies').should('not.exist');

    })
})
