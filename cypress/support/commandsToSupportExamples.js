Cypress.Commands.add('setupExampleWebsite', () => {
    cy.setBaseUrl('https://www.totaljobs.com');
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
