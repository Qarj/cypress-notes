Cypress.Commands.add('blockUnwantedRequests', () => {
    blockDomain('www.bat.bing');
    blockDomain('tags.tiqcdn.com');
    blockDomain('.*tealiumiq.com');
    blockDomain('.*doubleclick.net');
    blockDomain('.*go-mpulse.net');
    blockDomain('apis.google.com');
    blockDomain('.*omtrdc.net');
    blockPath('performancelogger');
    blockPath('/gsi/status');
    blockPath('analytics-library.js');
});
function blockDomain(domain) {
    let regex = new RegExp('https://' + domain + '.*', 'is');
    cy.intercept(regex, '');
}
function blockPath(path) {
    let regex = new RegExp('.*' + path + '.*', 'is');
    cy.intercept(regex, '');
}

Cypress.Commands.add('checkExistingInterceptions', (string) => {
    const intercepts = Cypress.config('intercepts');
    for (let i = 0; i < intercepts.length; i++) {
        const intercept = intercepts[i];
        const requestBody = JSON.stringify(intercept.request.body);
        if (requestBody.includes(string)) {
            return cy.wrap(intercept);
        }
        cy.log(`Did not find in existing interception index ${i}`, requestBody);
    }
    return cy.wrap(false);
});

Cypress.Commands.add('getInterceptWithPostBodyContainingString', function (alias, string) {
    cy.log(`checkExistingInterceptions containing ${string}`);
    cy.checkExistingInterceptions(string).then((result) => {
        // cy.log(`Logging the result of checkExistingInterceptions: ${result}`);
        if (result) {
            cy.log(`Found existing intercept containing ${string} in post body`).then(() => {
                return cy.wrap(result);
            });
        } else {
            cy.log('Did not find in existing intercepts, waiting for new one.');
            cy.log(`Will wait for intercept with post body containing ${string} --> `);
            cy.waitForNextIntercept(alias, string).then((res) => {
                return cy.wrap(res);
            });
        }
    });
});

/**
 *
 * @param {object} alias Request alias
 * @param {string} string String to look for in request post body
 */

Cypress.Commands.add('waitForNextIntercept', (alias, string) => {
    cy.log(`Started waitForNextIntercept intecept post body containing ${string}`);
    let intercepts = Cypress.config('intercepts');
    cy.log(`There are currently ${intercepts.length} intercepts.`);

    cy.wait(alias).then((intercept) => {
        cy.log(`New intercept for ${alias}`);
        cy.log(`Adding to existing intercepts: ${JSON.stringify(intercept.request.body)}`).then(() => {
            intercepts.push(intercept);
            Cypress.config('intercepts', intercepts);

            const requestBody = JSON.stringify(intercept.request.body);
            if (requestBody.includes(string)) return cy.wrap(intercept);
            else {
                cy.log(`${string} not found in new intercept request post body, waiting for next intercept.`);
                return cy.waitForNextIntercept(alias, string);
            }
        });
    });
});
