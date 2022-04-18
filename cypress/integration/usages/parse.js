const util = require('../../util/util');
util.reportScreenshotOnFailure();

context('Usage examples of parse commands', () => {
    it('should parse page html of current page', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.visit('/job/0');
        cy.parsePageHtml('recent-([a-z]+)-container').then((parsed) => {
            expect(parsed).to.equal('search');
        });
    });

    it('should parse page text of current page', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.visit('/job/0');
        cy.parsePageText('Lorem ([a-z]+) dolor').then((parsed) => {
            expect(parsed).to.equal('ipsum');
        });
    });

    it('should return an array of matches', () => {
        cy.setupExampleWebsite();
        cy.blockUnwantedRequests();
        cy.visit('/');
        cy.parsePageAllMatches('([0-9]{7,10})').then((ids) => {
            expect(ids.length).to.be.greaterThan(0);
            cy.report(ids);
        });
    });

    it('should parse first job id in string', () => {
        cy.setupExampleWebsite();
        const myString = 'This is a string with a job id: 123456789, and another job id: 987654321';
        cy.parseFirstJobId(myString).then((id) => {
            expect(id).to.equal('123456789');
        });
    });

    it('should parse all job ids in string', () => {
        cy.setupExampleWebsite();
        const myString = 'This is a string with a job id: 123456789, and another job id: 987654321, that is all.';
        cy.parseAllJobIds(myString, ': ', ',').then((ids) => {
            expect(ids[0]).to.equal('123456789');
            expect(ids[1]).to.equal('987654321');
        });
    });
});
