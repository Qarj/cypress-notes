describe('Challenge 01', function () {
    it('signs into Totaljobs using browser', function () {
        cy.setupExampleWebsite();
        cy.visit('https://www.totaljobs.com');
        cy.contains(/^Accept All$/).click();

        cy.get('[data-target="#navbar-desktop-signin-links"]').click();

        cy.contains('Jobseeker sign in').click();

        cy.get('[name="Form.Email"]').type('example_jobseeker@example.com');

        cy.get('[name="Form.Password"]').type('example1');

        cy.get('[value="Sign in"]').click();
    });
});
