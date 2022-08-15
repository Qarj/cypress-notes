const addContext = require('mochawesome/addContext');

function accept_cookies() {
    const CONSENTMGR =
        'c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1603662984214%7Cconsent:true';
    cy.setCookie('CONSENTMGR', CONSENTMGR);
}

function changeToReleaseTestsDir() {
    const releaseTestsDir = 'cypress-notes';
    while (process.cwd().endsWith(releaseTestsDir) === false) {
        console.log(`WRONG CURRENT DIRECTORY ::: ${process.cwd()}`);
        process.chdir('..');
        console.log(`FIXED CURRENT DIRECTORY ::: ${process.cwd()}`);
    }
}

function example_login() {
    // Cannot use JSON since two Form.RememberMe need to be posted, one will be lost
    const postbody =
        'Form.Email=example_jobseeker@example.com&Form.Password=example1&Form.RememberMe=true&Form.RememberMe=false';
    const signin_url = '/account/signin';
    cy.request({
        method: 'POST',
        url: signin_url,
        followRedirect: false,
        form: true,
        body: postbody,
    }).then((response) => {
        expect(response.status).to.match(/(302)/);
    });
}

function escape(value) {
    value = value.replace(/ /g, '%20');
    value = value.replace(/\\/g, '%22');
    value = value.replace(/\$/g, '%24');
    value = value.replace(/&/g, '%24');
    value = value.replace(/'/g, '%27');
    value = value.replace(/\+/g, '%2B');
    value = value.replace(/\//g, '%2F');
    value = value.replace(/</g, '%3C');
    value = value.replace(/>/g, '%3E');
    return value;
}

function getElementVisibleText(locator) {
    return Cypress.$(`${locator} *:not(:has(*)):visible`).text();
}

function getPath(url) {
    let fragments = url.split('//')[1].split('/');
    fragments.shift();
    return '/' + fragments.join('/');
}

function key() {
    const { v4: uuidv4 } = require('uuid');
    return uuidv4().substring(0, 8);
}

function parseForm(name, text) {
    let value = parseResponse(`name="${name}"[^>]+value="([^"]+)"`, text);
    if (value === '') {
        value = parseResponse(`value="([^"]+)"[^>]+name="${name}"`, text);
    }
    return value;
}

function parseText(regexString, text) {
    const regex = new RegExp(regexString);
    if (regex.test(text)) {
        const match = text.match(regex);
        cy.log(`Match: ${match[1]}`);
        return match[1];
    } else {
        cy.log('No matches could be found.');
    }
    return '';
}

// parseResponse
// return the first matching capture or empty string if not found
// example: parseResponse('type="text/css" href="([^ ]+)"', text)
function parseResponse(regex, text) {
    let capture = '';
    const re = new RegExp(regex, 'g');
    let matches = re.exec(text);
    if (matches != null) {
        capture = matches[1];
    }
    return capture;
}

class BodyBuilder {
    constructor(height, width) {
        this.fields = [];
    }

    push(name, value, escape = false) {
        if (escape) {
            value = value.replace(/ /g, '%20');
            value = value.replace(/\\/g, '%22');
            value = value.replace(/\$/g, '%24');
            value = value.replace(/&/g, '%24');
            value = value.replace(/'/g, '%27');
            value = value.replace(/\+/g, '%2B');
            value = value.replace(/\//g, '%2F');
            value = value.replace(/</g, '%3C');
            value = value.replace(/>/g, '%3E');
        }
        return this.fields.push(`${name}=${value}`);
    }

    body() {
        let build = '';
        this.fields.forEach(function (entry) {
            build += entry + '&';
        });
        return build.slice(0, -1);
    }
}

function reportScreenshotOnFailure(message = 'Screenshot on failure') {
    // IMPORTANT: Ensure "const addContext = require('mochawesome/addContext');" at top of file else fails silently
    let screenshotFailureMessage;
    let base64ImageFailure;

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            let titlePathArray = this.currentTest.titlePath();

            const spec = titlePathArray[0].trim();
            const test = titlePathArray[1].trim();
            const screenshotFileName = `${spec} -- ${test} \(failed\).png`.replace(/[/":]/g, '');
            const screenshotBasePath = `${Cypress.config('screenshotsFolder')}/${
                Cypress.spec.name
            }/${screenshotFileName}`;

            cy.task('readScreenshotMaybe', screenshotBasePath).then((file) => {
                base64ImageFailure = file;
            });

            screenshotFailureMessage = message;
        }
    });
    Cypress.on('test:after:run', (test, runnable) => {
        if (screenshotFailureMessage) {
            addContext(
                { test },
                {
                    title: screenshotFailureMessage,
                    value: 'data:image/png;base64,' + base64ImageFailure,
                },
            );
        }

        screenshotFailureMessage = ''; // To stop spurious reporting for other tests in the same file
        base64ImageFailure = '';
    });
}

function stubConsole() {
    return {
        onBeforeLoad(win) {
            cy.stub(win.console, 'log').as('consoleLog');
            cy.stub(win.console, 'error').as('consoleError');
        },
    };
}

module.exports = {
    accept_cookies,
    changeToReleaseTestsDir,
    escape,
    getElementVisibleText,
    getPath,
    example_login,
    key,
    parseForm,
    parseResponse,
    parseText,
    BodyBuilder,
    reportScreenshotOnFailure,
    stubConsole,
};
