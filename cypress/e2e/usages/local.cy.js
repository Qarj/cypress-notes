const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of local storage commands', () => {
    it('should get using http', () => {
        cy.setupExampleWebsite();
        cy.visit('/');
        cy.restoreLocalStorage('example'); // will do nothing if handle does not exist - safe first run!
        cy.saveLocalStorage('example');
        cy.restoreLocalStorage('example');
    });
});
