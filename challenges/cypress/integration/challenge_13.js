describe('actionOnContains', function () {
    it('Gets the jobseeker homepage', function () {
        cy.visit('https://www.totaljobs.com/');

        cy.actionOnContains('NonExistingText', 'Accept All', function () {
            cy.contains('Accept All').click();
        });

        cy.actionOnContains('Freedom is finding', 'NonExistingText', function () {
            cy.contains('Search').click();
        });
    });
});
