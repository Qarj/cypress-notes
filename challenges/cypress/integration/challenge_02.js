describe('Log into Totaljobs with http then load page in browser behind login', function () {
    it('Signs into Totaljobs, opens account page', function () {

        // Cannot use JSON since two Form.RememberMe need to be posted, one will be lost
        let postbody = 'Form.Email=example_jobseeker@example.com&Form.Password=example1&Form.RememberMe=true&Form.RememberMe=false'

        let signin_url = 'https://www.totaljobs.com/account/signin'

        cy.request({
            method: 'POST',
            url: signin_url,
            followRedirect: false,
            form: true,
            body: postbody
        }).then((response) => {
            expect(response.status).to.eq(302)
        } )

        let account_url = 'https://www.totaljobs.com/Authenticated/Default.aspx'

        cy.request({
            method: 'GET',
            url: account_url,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.contain('Welcome back')
        } )

        // Cypress automatically copies over the cookies to the browser session
        cy.visit(account_url);

    })
})
