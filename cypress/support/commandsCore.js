// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('assertContainsOrActionIfContains', (assertText, actionText, action, customTimeout = 0) => {
    let dynamicRegex = `(${assertText}|${actionText})`;
    let regexObj = new RegExp(dynamicRegex);
    if (customTimeout) {
        cy.contains(regexObj, { timeout: customTimeout });
    } else {
        cy.contains(regexObj);
    }
    cy.get('body').then(($body) => {
        if ($body.text().includes(actionText)) {
            cy.log('Action text found, performing conditional action.');
            action();
        } else {
            cy.log('Action text not found.');
        }
    });
});

Cypress.Commands.add('assertContainsOrFailFastIfContains', (okRegexString, failureRegexString, customTimeout = 0) => {
    let combinedRegex = `${okRegexString}|${failureRegexString}`;
    let okRegex = new RegExp(combinedRegex);
    if (customTimeout) {
        cy.contains(okRegex, { timeout: customTimeout });
    } else {
        cy.contains(okRegex);
    }
    cy.get('body').then(($body) => {
        let failureRegex = new RegExp(failureRegexString);
        if ($body.text().search(failureRegex) > -1) {
            cy.report(`Failure condition [${failureRegexString}] found, failing test now.`).then(() => {
                expect(false).to.equal(true);
            });
        } else {
            cy.log('All is ok.');
        }
    });
});

Cypress.Commands.add('dumpCookies', () => {
    cy.getCookies().then((cookies) => {
        cy.log('Dumping session cookies').then(() => {
            for (let i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (!cookie.expiry) {
                    cy.dumpCookie(cookie);
                }
            }
        });
        cy.log();
        cy.log('Dumping persistent cookies').then(() => {
            for (let i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (cookie.expiry) {
                    cy.dumpCookie(cookie);
                }
            }
        });
        cy.log();
    });
});

Cypress.Commands.add('dumpCookie', (cookie) => {
    cy.log(
        `${cookie.name} ${cookie.value}`,
        `domain: ${cookie.domain} expiry: ${cookie.expiry} httpOnly: ${cookie.httpOnly} path: ${cookie.path} secure: ${cookie.secure}`,
    );
});

Cypress.Commands.add('multipartFormRequest', (method, url, formData, done) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(xhr);
    };
    xhr.onerror = function () {
        done(xhr);
    };
    xhr.send(formData);
});

// Report a comment in mochawesome and Cypress Runner
Cypress.Commands.add('report', (text) => {
    const addContext = require('mochawesome/addContext');
    let comment;

    Cypress.on('test:after:run', (test, runnable) => {
        if (comment) {
            addContext({ test }, { title: 'Comment', value: comment });
        }

        comment = ''; // To stop spurious reporting for other tests in the same file
    });

    comment = text;
    cy.log(comment);
});

Cypress.Commands.add('setBaseUrl', (baseUrl) => {
    Cypress.config('baseUrl', baseUrl);
    const html = `<!DOCTYPE html><html><body><h1>Initialise Cypress to ${baseUrl}</h1></body></html>`;
    cy.intercept('GET', '/initialise_cypress_session.html', html);
    cy.visit('/initialise_cypress_session.html');
});

Cypress.Commands.add('reportScreenshot', (text = 'No description') => {
    const addContext = require('mochawesome/addContext');
    let screenshotDescription;
    let base64Image;

    Cypress.on('test:after:run', (test, runnable) => {
        if (screenshotDescription) {
            addContext(
                { test },
                {
                    title: screenshotDescription,
                    value: 'data:image/png;base64,' + base64Image,
                },
            );
        }

        screenshotDescription = ''; // To stop spurious reporting for other tests in the same file
        base64Image = '';
    });

    screenshotDescription = text;
    const { v4: uuidv4 } = require('uuid');
    const key = uuidv4().substring(0, 8);
    const screenshotPath = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/reportScreenshot_${key}.png`;
    cy.log(`Taking screenshot: ${screenshotDescription}`);
    cy.screenshot(`reportScreenshot_${key}`);
    cy.determineRealPath(screenshotPath).then((realPath) => {
        // Cypress might add something like ' (attempt 2)'
        cy.readFile(realPath, 'base64').then((file) => {
            base64Image = file;
        });
    });
});

Cypress.Commands.add('determineRealPath', (supposedPath) => {
    const supposedPathNoExt = supposedPath.slice(0, -4);

    function testPath(attempt) {
        if (attempt < 0) {
            cy.log('All attempts to find the file failed.');
            return cy.wrap(supposedPath);
        }

        let attemptSuffix = ` (attempt ${attempt}).png`;
        if (attempt === 0) attemptSuffix = '.png';
        const tryPath = supposedPathNoExt + attemptSuffix;
        cy.task('isFile', tryPath).then((exists) => {
            if (exists) {
                cy.log(`Found path ${tryPath}`);
                return cy.wrap(tryPath);
            }
            return testPath(attempt - 1);
        });
    }

    const maxPossibleAttempts = 4; // Cypress will retry up to a max of 4 times
    testPath(maxPossibleAttempts);
});

Cypress.Commands.add('requestAndReport', (request) => {
    const addContext = require('mochawesome/addContext');
    let url;
    let duration;
    let responseBody;
    let responseHeaders;
    let requestHeaders;

    Cypress.on('test:after:run', (test, runnable) => {
        if (url) {
            addContext({ test }, { title: 'Request url', value: url });
            addContext({ test }, { title: 'Duration', value: duration });
            addContext({ test }, { title: 'Request headers', value: requestHeaders });
            addContext({ test }, { title: 'Response headers', value: responseHeaders });
            addContext({ test }, { title: 'Response body', value: responseBody });
        }

        // To stop spurious reporting for other tests in the same file
        url = '';
        duration = '';
        requestHeaders = {};
        responseHeaders = {};
        responseBody = {};
    });

    let requestOptions = request;
    if (typeof request === 'string') {
        requestOptions = { url: request };
    }
    url = requestOptions.url;

    cy.request(requestOptions).then(function (response) {
        duration = response.duration;
        responseBody = response.body;
        responseHeaders = response.headers;
        requestHeaders = response.requestHeaders;
        return response;
    });
});
