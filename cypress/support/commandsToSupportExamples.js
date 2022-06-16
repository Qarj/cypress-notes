Cypress.Commands.add('closeAccountIfExists', (email, pass) => {
    cy.loginNoAssertion(email, pass).then((success) => {
        if (!success) return;
        cy.log(`Was able to log into account ${email} - closing it.`);
        cy.visit('/Authenticated/UserPreferences.aspx#CloseAccount');
        cy.get('a[id=lnkUnsubscribe]').click();
        cy.get('input[name=btnUnsubscribe]').click();
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
        retryOnStatusCodeFailure: true,
        failOnStatusCodeFailure: false,
        method: 'POST',
        url: `/account/signin?ReturnUrl=%2f`,
        followRedirect: true,
        form: true,
        body: postbody,
    }).then((response) => {
        if (response.status === 200) return cy.wrap(true);
        return cy.wrap(false);
    });
});
