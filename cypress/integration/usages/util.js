const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of util', () => {
    it('should generate a unique 8 letter key', () => {
        cy.log(`This is a unique key: ${util.key()}`);
    });
});
