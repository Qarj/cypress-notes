describe('Totaljobs Sign In', function () {
    it('Signs into Totaljobs', function () {
        cy.visit('https://www.totaljobs.com')
        
        cy.get('.accept-button-new').click();

        cy.get('[data-target="#navbar-desktop-signin-links"]').click()
    })
})
