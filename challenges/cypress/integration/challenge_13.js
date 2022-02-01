describe('actionOnContains', function () {
    it('Gets the jobseeker homepage', function () {
        cy.visit('https://www.totaljobs.com/');

        cy.assertContainsOrActionIfContains('NonExistingText', 'Accept All', function () {
            cy.contains('Accept All').click();
        });

        cy.assertContainsOrActionIfContains('Freedom is finding', 'NonExistingText', function () {
            cy.contains('Search').click();
        });
    });
});
