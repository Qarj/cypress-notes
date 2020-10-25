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

module.exports = {
    example_login
}
