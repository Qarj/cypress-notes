const util = require('../../util/util');
util.reportScreenshotOnFailure();

// Setup that was done
//
// cd $HOME/git/cypress-notes/cypress/fixtures
// base64 example.zip > example.zip.base64

context('Usage examples posting to multipart forms', () => {
    it('should post to a multipart form using the new method so long as I do not use arrow syntax', function () {
        // DO NOT USE ARROW SYNTAX !!!
        const postedFileName = 'example.zip';
        const baseUrl = 'http://httpbin.org';
        Cypress.config('baseUrl', baseUrl); // cy.visit will make use of this, it does not pick up the baseUrl from the current browser domain
        const postUrl = `${baseUrl}/post`;
        const base64FileName = `${postedFileName}.base64`; // place in fixtures

        // do the GET request, if required, for the multipart form
        cy.request('/').as('multipartForm');

        // specify the zip file we are posting in base64 format
        cy.fixture(base64FileName).as('base64File');

        cy.get('@multipartForm').then((response) => {
            const formData = new FormData();
            formData.append('version', '9.5.4'); // append all the regular non file fields

            const mimeType = 'application/zip';
            const blob = Cypress.Blob.base64StringToBlob(this.base64File, mimeType);
            formData.append('uploadFile', blob, postedFileName);

            cy.request({
                url: postUrl,
                method: 'POST',
                headers: {
                    'content-type': 'multipart/form-data',
                },
                body: formData,
            })
                .its('status')
                .should('be.equal', 200);
        });
    });

    it('should post to a multipart form using the old method so long as I do not use arrow syntax', function () {
        // DO NOT USE ARROW SYNTAX !!!
        const postedFileName = 'example.zip';
        const baseUrl = 'http://httpbin.org';
        Cypress.config('baseUrl', baseUrl); // cy.visit will make use of this, it does not pick up the baseUrl from the current browser domain
        const postUrl = `${baseUrl}/post`;
        const base64FileName = `${postedFileName}.base64`; // place in fixtures

        // do the GET request, if required, for the multipart form
        cy.request('/').as('multipartForm');

        // specify the zip file we are posting in base64 format
        cy.fixture(base64FileName).as('base64File');

        cy.get('@multipartForm').then((response) => {
            const formData = new FormData();
            formData.append('version', '9.5.4'); // append all the regular non file fields

            const mimeType = 'application/zip';
            const blob = Cypress.Blob.base64StringToBlob(this.base64File, mimeType);
            formData.append('uploadFile', blob, postedFileName);

            cy.intercept({
                method: 'POST',
                url: postUrl,
            }).as('xhrRequest');

            // Do the multipart form post
            cy.multipartFormRequest('POST', postUrl, formData, function (response) {
                // Cypress does not fail on the expects inside the callback
            });

            cy.wait('@xhrRequest').then((res) => {
                cy.report('Multipart response');
                cy.log(res);
                cy.report(res.request.url);
                cy.report(res.request.headers['content-type']);
                cy.report(res.request.headers.cookie);
                cy.report(res.request.headers.host);
                cy.report(res.request.headers.referer);
                cy.report(res.response.body);
                cy.report(res.response.statusCode).then(() => {
                    expect(JSON.stringify(res.response.body)).to.contain('multipart');
                });
            });
        });
    });
});
