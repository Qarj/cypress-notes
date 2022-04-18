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
