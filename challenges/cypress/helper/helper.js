function example_login (brand_url) {
    // Cannot use JSON since two Form.RememberMe need to be posted, one will be lost
    const postbody = 'Form.Email=example_jobseeker@example.com&Form.Password=example1&Form.RememberMe=true&Form.RememberMe=false';

    const signin_url = brand_url + '/account/signin';

    cy.request({
        method: 'POST',
        url: signin_url,
        followRedirect: false,
        form: true,
        body: postbody
    }).then((response) => {
        expect(response.status).to.eq(302)
    } );
}

function accept_cookies () {
    const CONSENTMGR = 'c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1603662984214%7Cconsent:true';
    cy.setCookie('CONSENTMGR', CONSENTMGR);
}

module.exports = {
    example_login,
    accept_cookies
}
