describe('Log into CWJobs or Totaljobs by changing baseUrl', function () {
    it('Signs into Jobseeker', function () {
        const baseUrl = Cypress.config().baseUrl;

        cy.visit(baseUrl);
        
        cy.get('[data-target="#navbar-desktop-signin-links"]').click();

        cy.contains('Jobseeker sign in').click();

        cy.get('[name="Form.Email"]').type('example_jobseeker@example.com');

        cy.get('[name="Form.Password"]').type('example1');

        cy.get('[value="Sign in"]').click();
    })
})
