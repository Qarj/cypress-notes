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
import { inspect } from 'util';
const addContext = require('mochawesome/addContext');
const util = require('../util/util');

Cypress.Commands.overwrite('log', (subject, message) => {
    cy.task('log', inspect(message)); // prevent circular reference with built in inspect util function
});

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

Cypress.Commands.add('logObjectKeysOnePerLine', (obj, indent = 0) => {
    let spaces = '';
    for (let i = 0; i < indent; i++) {
        spaces += '.';
    }
    // Cypress removes all spaces and carriage returns from the log, so we need to do it manually
    for (const key in obj) {
        if (typeof obj[key] === 'object') cy.logObjectKeysOnePerLine(obj[key], indent + 2);
        else cy.log(`${spaces}${key}: ${obj[key]}`);
    }
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
    // IMPORTANT: Ensure "const addContext = require('mochawesome/addContext');" at top of file else fails silently
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

Cypress.Commands.add('reportScreenshot', (text = 'No description', options = {}) => {
    // IMPORTANT: Ensure "const addContext = require('mochawesome/addContext');" at top of file else fails silently

    options.overwrite = true;
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
    const key = util.key();
    const screenshotPath = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/reportScreenshot_${key}.png`;
    cy.log(`Taking screenshot: ${screenshotDescription}`);
    cy.screenshot(`reportScreenshot_${key}`, options);
    cy.task('readScreenshotMaybe', screenshotPath).then((file) => {
        base64Image = file;
    });
});

Cypress.Commands.add('requestAndReport', (request) => {
    // IMPORTANT: Ensure "const addContext = require('mochawesome/addContext');" at top of file else fails silently
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

Cypress.Commands.add('removeItem', function (name) {
    let items = getItemsFromLocalStorage();
    if (items.hasOwnProperty(name)) delete items[name];
    localStorage.setItem('cypressSavedItems', JSON.stringify(items));
});

Cypress.Commands.add('getItem', function (name) {
    let items = getItemsFromLocalStorage();
    if (!items.hasOwnProperty(name)) items[name] = '';
    return cy.wrap(items[name]);
});

Cypress.Commands.add('setItem', function (name, value) {
    let items = getItemsFromLocalStorage();
    items[name] = value;
    localStorage.setItem('cypressSavedItems', JSON.stringify(items));
});

function getItemsFromLocalStorage() {
    let items = localStorage.getItem('cypressSavedItems');
    if (items === null) {
        items = {};
    } else {
        items = JSON.parse(items);
    }
    return items;
}
