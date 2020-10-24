describe('Totaljobs Sign In', function () {
    it('Signs into Totaljobs', function () {
        cy.visit('https://www.totaljobs.com');
        
        cy.get('.accept-button-new').click();

        cy.get('[data-target="#navbar-desktop-signin-links"]').click();

        cy.contains('Jobseeker sign in').click();

        cy.get('[name="Form.Email"]').type('example_jobseeker@example.com');

        cy.get('[name="Form.Password"]').type('example1');

        cy.get('[value="Sign in"]').click();
    })
})
