const util = require('../util/util');

Cypress.Commands.add('closeAccountIfExists', (email, pass) => {
    cy.loginNoAssertion(email, pass).then((success) => {
        if (!success) return;
        cy.log(`Was able to log into account ${email} - closing it.`);
        cy.visit('/Authenticated/UserPreferences.aspx#CloseAccount');
        cy.get('a[id=lnkUnsubscribe]').click();
        cy.get('input[name=btnUnsubscribe]').click();
    });
});

Cypress.Commands.add('closeAccountTJG', () => {
    cy.request({
        method: 'GET',
        url: '/Authenticated/Unsubscribe.aspx',
        failOnStatusCode: true,
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.contains('close your account');
        const VIEWSTATE = util.escape(util.parseText('id="__VIEWSTATE" value="([^"]*)"', response.body));
        const VIEWSTATEGENERATOR = util.parseText('id="__VIEWSTATEGENERATOR" value="([^"]*)"', response.body);
        cy.request({
            method: 'POST',
            body: `__VIEWSTATE=${VIEWSTATE}&__VIEWSTATEGENERATOR=${VIEWSTATEGENERATOR}&Keywords=Totaljobs+Group&LTxt=&LocationType=10&Keywords=Totaljobs+Group&LTxt=&LocationType=10&btnUnsubscribe=Close+my+account`,
            url: '/Authenticated/Unsubscribe.aspx',
            failOnStatusCode: true,
            form: true,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.contains('UnsubscribeConfirm');
            cy.log(`Closed account.`);
        });
    });
});

Cypress.Commands.add('setupExampleWebsite', () => {
    cy.setBaseUrl('https://www.totaljobs.com');
});

Cypress.Commands.add('setupHttpBin', () => {
    cy.setBaseUrl('http://httpbin.org/');
});

Cypress.Commands.add('setupJsonPlaceholder', () => {
    cy.setBaseUrl('https://jsonplaceholder.typicode.com');
});

Cypress.Commands.add('loginExample', (email) => {
    cy.report(`Login with ${email}.`);
    const password = 'Example_123';
    let postbody = `Form.Email=${email}&Form.Password=${password}&Form.RememberMe=true`;
    cy.request({
        retryOnStatusCodeFailure: true,
        method: 'POST',
        url: `/account/signin?ReturnUrl=%2f`,
        followRedirect: true,
        form: true,
        body: postbody,
    }).then((response) => {
        expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add('loginNoAssertion', (email, pass) => {
    cy.report(`Attempt login with ${email}.`);
    let postbody = `Form.Email=${email}&Form.Password=${pass}&Form.RememberMe=true`;
    cy.request({
        retryOnStatusCodeFailure: false,
        failOnStatusCodeFailure: false,
        method: 'POST',
        url: `/account/signin?ReturnUrl=%2f`,
        followRedirect: false,
        form: true,
        body: postbody,
    }).then((response) => {
        cy.request({
            retryOnStatusCodeFailure: false,
            failOnStatusCodeFailure: false,
            method: 'GET',
            url: `/authenticated/profile.aspx`,
            followRedirect: true,
            form: true,
            body: postbody,
        }).then((response) => {
            if (JSON.stringify(response.body).includes('Home postcode')) {
                return cy.wrap(true);
            }
            return cy.wrap(false);
        });
    });
});

Cypress.Commands.add('setCookieConsent', () => {
    cy.setCookie(
        'CONSENTMGR',
        'c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:0%7Cc6:1%7Cc7:1%7Cc8:0%7Cc9:1%7Cc10:0%7Cc11:0%7Cc12:1%7Cc13:1%7Cc14:0%7Cc15:0%7Cts:1661420561218%7Cconsent:true',
    );
    localStorage.setItem('consent_level', '{"isEssential": true, "isFunctional": true}');
});
