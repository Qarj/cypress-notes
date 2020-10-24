describe('Totaljobs http Sign In', function () {
    it('Signs into Totaljobs with http', function () {

        let postbody = 'Form.Email=example_jobseeker@example.com&Form.Password=example1&Form.RememberMe=true&Form.RememberMe=false'

        let url = 'https://www.totaljobs.com/account/signin'

        cy.request({
            method: 'POST',
            url: url,
            followRedirect: false,
            form: true,
            body: postbody
        }).then((response) => {
            expect(response.status).to.eq(302)
        } )

        cy.request({
            method: 'GET',
            url: 'https://www.totaljobs.com/Authenticated/Default.aspx',
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.contain('Welcome back')
        } )

    })
})