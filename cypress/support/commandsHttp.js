Cypress.Commands.add('httpGet', function (path, expectedStatus, expectedContent, notExpectedContent = 'will_not_be_found') {
    const baseUrl = Cypress.config().baseUrl;
    const getUrl = `${baseUrl}${path}`;

    const expectedRE = new RegExp(expectedContent);
    const notExpectedRE = new RegExp(notExpectedContent);

    cy.request({
        url: getUrl,
        failOnStatusCode: false,
        method: 'GET',
        timeout: 90000,
    }).then((response) => {
        expect(JSON.stringify(response.body)).to.match(expectedRE);
        expect(JSON.stringify(response.body)).to.not.match(notExpectedRE);
        expect(response.status).to.eq(expectedStatus);
        return cy.wrap(response);
    });
});

Cypress.Commands.add('httpGetRetry', function (path, expectedStatus, expectedContent, retryMax = 95, waitMs = 10000) {
    const baseUrl = Cypress.config().baseUrl;
    const getUrl = `${baseUrl}${path}`;
    const expectedRE = new RegExp(expectedContent);

    const options = {
        url: getUrl,
        failOnStatusCode: false,
        method: 'GET',
    };

    let retries = 0;

    function makeRequest() {
        retries++;
        return cy.request(options).then(function (response) {
            if (expectedRE.test(JSON.stringify(response.body))) {
                cy.log(`Expected content found on attempt ${retries}`);
                return cy.wrap(response);
            } else {
                if (retries === retryMax) {
                    cy.log(`Retried too many times (${retries}), giving up.`);
                } else {
                    cy.log(`Did not find ${expectedContent} in:`);
                    cy.log(JSON.stringify(response.body));
                    cy.log(`Attempt ${retries} failed, waiting ${waitMs} ms then trying again.`);
                    cy.wait(waitMs);
                    return makeRequest();
                }
            }
        });
    }

    makeRequest().then((response) => {
        expect(JSON.stringify(response.body)).to.match(expectedRE);
        expect(response.status).to.eq(expectedStatus);
    });
});
