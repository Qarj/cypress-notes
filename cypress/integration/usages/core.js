context('Usage examples of core commands', () => {
    it('should log comment in both mochawesome and cypress runner', () => {
        cy.report('Hey there!');
    });
});
