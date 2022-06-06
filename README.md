# cypress-notes

![Cypress tests](https://github.com/Qarj/cypress-notes/workflows/Release%20tests/badge.svg)

Notes on using Cypress.io

https://glebbahmutov.com/blog/cypress-tips-and-tricks

## Setup the challenges and run through GUI

```
cd challenges
npm i
npx cypress open
```

## Create a new Cypress project

```
mkdir my-new-project
cd my-new-project
npm config set registry http://npm.company.com/
npm init
npm install cypress --save-dev
npm install mochawesome --save-dev
npm install cypress-real-events --save-dev
npm install cypress-wait-until --save-dev
npm install @company/cypress-service-client
npm install eslint-plugin-cypress
```

Create a `.gitignore` file

```
node_modules/
npm-debug.log
debug.log
results/
videos/
screenshots/
```

## When npm install thinks cypress is installed but it isn't

```
npx cypress install
```

## Start Cypress / initialise

```
npx cypress open
node_modules/.bin/cypress open
```

## Run headlessly using electron

```
npx cypress run
```

## Run one spec file

```
npx cypress run --spec cypress/integration/challenge_02.js
```

## Run through various browsers headfully

```
npx cypress run --browser chrome
npx cypress run --browser chromium
npx cypress run --browser firefox
npx cypress run --browser edge
npx cypress run --browser electron --headed
```

## Show currently installed cypress version

```
npx cypress info
.
Proxy Settings: none detected
Environment Variables: none detected

Application Data: C:\Users\user\AppData\Roaming\cypress\cy\development
Browser Profiles: C:\Users\user\AppData\Roaming\cypress\cy\development\browsers
Binary Caches: C:\Users\user\AppData\Local\Cypress\Cache

Cypress Version: 6.9.1
System Platform: win32 (10.0.17763)
System Memory: 17.1 GB free 7.31 GB
```

## Remove clear windows app data in case of corruption

```
npx cypress open
```

File -> View App Data

Delete everything in the cy folder (typically found at `C:\Users\<user>\AppData\Roaming\cypress\cy\`)

## Show installed versions of cypress

```
npx cypress cache list
```

## Remove all but current installed versions of cypress

```
npx cypress cache prune
```

## Remove all installed versions of cypress

```
npx cypress cache clear
```

## Troubleshooting Error: ENOENT: no such file or directory, stat '/initrd.img'

The following error was thrown by a plugin. We stopped running your tests because a plugin crashed. Please check your plugins file.

```
Error: The following error was thrown by a plugin. We stopped running your tests because a plugin crashed. Please check your plugins file (`/home/tim/git/cypress-server/cypress/plugins/index.js`)
    at Object.get (/home/tim/.cache/Cypress/6.5.0/Cypress/resources/app/packages/server/lib/errors.js:966:15)
    at EventEmitter.handleError (/home/tim/.cache/Cypress/6.5.0/Cypress/resources/app/packages/server/lib/plugins/index.js:168:20)
    at EventEmitter.emit (events.js:315:20)
    at ChildProcess.<anonymous> (/home/tim/.cache/Cypress/6.5.0/Cypress/resources/app/packages/server/lib/plugins/util.js:19:22)
    at ChildProcess.emit (events.js:315:20)
    at emit (internal/child_process.js:876:12)
    at processTicksAndRejections (internal/process/task_queues.js:85:21)
```

but it turned out Visual Studio Code automatically added this line to the top of `commands.js`

```
const { expect } = require('chai');
```

## cypress.json

```json
{
    "browser": "electron",
    "headless": true,
    "video": true,
    "viewportWidth": 375,
    "viewportHeight": 1000,
    "defaultCommandTimeout": 30000,
    "requestTimeout": 30000,
    "env": {
        "brandHost": "mybrand.com",
        "name": "live",
        "blockHosts": ["*tealiumiq.com", "*tiqcdn.com"]
    },
    "retries": {
        "runMode": 2,
        "openMode": 0
    }
}
```

## test structure

```js
describe('Login workflow', () => {
    beforeEach(() => {
        cy.setCookie('CONSENTMGR', 'consent:true'); // stop cookie banner
    });

    it(
        'Should login as existing user',
        {
            retries: {
                runMode: 4,
                openMode: 0,
            },
        },
        () => {
            cy.visit('/login', { retryOnStatusCodeFailure: true });
        },
    );
});
```

## checking links

```js
it('Should have href attribute in the header arrow linking to MyColours', () => {
    cy.visit('/widgets');
    cy.get('[data-testid=title-arrow]').should('have.attr', 'href').and('include', 'MyColours.aspx');
    cy.get('[data-testid=title-arrow]').should('have.attr', 'target', '_blank');
});
```

## cy.contains

Get the element whose text exactly matches `Upload`

```js
cy.contains(/^Upload$/).click();
```

Scoping to a specific element

```js
cy.contains('Deployment status').parent().contains(envLink).click();
```

Can be chained off cy.get and has a selector option also

```js
cy.contains('div[name=priority]', 'Title').click();
```

## cy.get

```js
cy.get('[data=timefield]')
    .children('time')
    .then((date) => {
        expect(parseInt(date[0].dateTime)).to.be.greaterThan(parseInt(date[1].dateTime));
    });

cy.get('[data="logo"]')
    .children('img')
    .each((logo) => {
        expect(logo.get(0).src).not.to.be.empty;
    });

cy.get('[class=btn-close]').first().click({ force: true });
cy.contains('Log in').click({ force: true });

cy.get('[type=file][name=file]').attachFile('SmallCV.rtf');

cy.get('input[name=versionName]').clear().type('Hello World');
```

partial class name match

```js
cy.get('*[class^="convai-widget-button"]').as('convaiButton');
```

class starts with send and contains svg

```js
cy.get("button[class^='send'] > svg").should('have.css', 'fill', desiredColourRGB);
```

## cy.get then find to drill down into DOM with find and within

In this example, we get the recommender widget then find the job inside that specific widget

```js
cy.get('[data-component="component-RecommendedJobs"]')
    .find('[id="job-item-55667788"]')
    .find('[data-testid="unsavedjob-icon-star"]')
    .click({ scrollBehavior: 'center' });
```

Using the within keyword

```js
cy.get('[data-testid="attachment"').within(() => {
    cy.contains('Download icon').click();
});
```

## cy.request

```js
cy.request({
    url: '/search',
    method: 'GET',
    failOnStatusCode: false,
    headers: { Cookie: '' },
}).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.status).to.match(/(400|401)/);
    expect(res.body).to.have.property('results');
});
```

## cookies

```js
Cypress.Cookies.debug(true);
cy.getCookies().then((cookies) => {
    cookies.forEach((element) => cy.log(element.name));
});

cy.getCookie('auth').then((cookie) => {
    const token = cookie.value;
    cy.clearCookie('auth');
});
cy.clearCookies({ domain: Cypress.env('host') });

cy.get('[data="title"]').each((item) => {
    expect(item.get(0).innerText).not.to.be.empty;
    expect(item.get(0).getAttribute('href')).not.to.be.empty;
    expect(item.get(0).getAttribute('target')).to.eq('_blank');
});
```

See `commandsState.js` and `usages/state.js` for saving and restoring all browser session state.

```js
cy.restoreState('myLogin');
cy.saveState('myLogin');
```

See `commandsState.js` and `usages/state.js` for saving and restoring just the persistent cookies.

```js
cy.restorePersistentCookies('myLogin');
cy.savePersistentCookies('myLogin');
```

## conditional testing

Assert that some text is present or perform an action if other text is present

-   see command `assertContainsOrActionIfContains` in `commandsConditional.js` and `usages/conditional.js`

Click something if present, after verifying it is present for a period of time (maybe DOM rewriting causing issues)

-   see command `clickLocatorIfConsistentlyVisible` in `commandsConditional.js` and `usages/conditional.js`

```js
Cypress.Commands.add('clickTextIfConsistentlyPresent', function (text) {
    cy.isTextConsistentlyPresent(text).then((result) => {
        if (result) {
            cy.log('Going to attempt contains click.');
            cy.contains(text).click();
        }
    });
});

Cypress.Commands.add('isTextConsistentlyPresent', function (text) {
    cy.isTextPresent(text).then((result) => {
        if (!result) return cy.wrap(result);
        cy.wait(1000);
        cy.isTextPresent(text).then((result) => {
            return cy.wrap(result);
        });
    });
});

Cypress.Commands.add('isTextPresent', function (text) {
    cy.log('Executing isTextPresent: ' + text);
    cy.get('body').then(($body) => {
        if ($body.text().includes(text)) {
            cy.log(`Found ${text} present in body.`);
            return cy.wrap(true);
        }
        cy.log(`${text} NOT FOUND in body.`);
        return cy.wrap(false);
    });
});

Cypress.Commands.add('isTextConsistentlyVisibleInElement', function (text, element) {
    cy.isTextVisibleInElement(text, element).then((result) => {
        if (!result) return cy.wrap(result);
        cy.wait(1500);
        cy.isTextVisibleInElement(text, element).then((result) => {
            return cy.wrap(result);
        });
    });
});

Cypress.Commands.add('isTextVisibleInElement', function (text, element) {
    cy.waitForTextVisibleInElementToStabilise(element);
    cy.log(`Executing isTextVisibleInElement ${text} in ${element}`);
    cy.get(element);
    const visibleText = Cypress.$(`${element} *:not(:has(*)):visible`).text();
    cy.log(`Visible text: ${visibleText}`);
    if (visibleText.includes(text)) {
        cy.log(`Found ${text} in element ${element}.`);
        return cy.wrap(true);
    }
    return cy.wrap(false);
});

Cypress.Commands.add('waitForTextVisibleInElementToStabilise', function (element) {
    cy.log(`Executing waitForTextVisibleInElementToStabilise in ${element}`);

    let oldVisibleText = '__initialised__';
    let attempts = 0;
    const maxAttempts = 10;

    const waitStabilise = function () {
        attempts++;
        if (attempts > maxAttempts) return cy.log(`Max attempts reached, text did not stabilise`);
        cy.get(element);
        const visibleText = Cypress.$(`${element} *:not(:has(*)):visible`).text();
        cy.log(`Current visible text: ${visibleText}`);
        if (visibleText === oldVisibleText) return cy.log(`Visible text has stabilised.`);
        oldVisibleText = visibleText;
        cy.wait(1001).then(() => {
            waitStabilise();
        });
    };

    waitStabilise();
});
```

## element is getting detached from the DOM

When a React page is rendered the elements tend to get updated moments after being first created.
Cypress tends to run too quickly, or the page too slowly, especially under CI.

Cypress.io advises that you should figure out what condition to wait for, and assert that condition
before trying to do what you really want to do. I fundamentaly disagree that you should need to understand
the inner workings of a page to automate it robustly. Do you expect actual users should know the fine
details of your page to use it robustly?

Here we get the element several times with a short pause in between, then use the element.

```js
cy.getElementConsistently('[data-testid="apply-job-button"]').first().click();
```

See `commandsRobust.js` and `usages/robust.js` for interacting with an element getting detached from the dom.

## expect assertions

```html
<i class="material-icons">message</i>
```

```js
cy.get('[class=material-icons]').then((item) => {
    expect(item.get(0).innerText).to.contain('message');
});
expect(res.status).to.eq(200);
expect(res.status).to.match(/(400|401)/);
expect(res.body).to.have.property('results');
expect(res.body).to.have.property('results').and.to.have.length.greaterThan(0);
expect(title).not.be.null.and.not.to.be.an('undefined');
expect(newAuth).not.to.be.undefined;
expect(response.body.results).to.not.be.empty;
expect(JSON.stringify(res.body)).not.contain('12344321');
expect(newAuth).not.to.contains(originalToken);
const locationResults = res.body.results.filter((result) => result.type === 'location');
expect(locationResults.length).to.equal(0);
expect(locationResults.length).to.be.greaterThan(0);
locationResults.map((res) => {
    expect(res.text).to.match(/(TOP DEAL|BEST OFFER)/);
});
expect(item.get(0).innerText).match(/Click here/g);

cy.get('html:root').then((html) => {
    expect(html).not.contain('We use cookies');
});

cy.visit('/my/feature/')
    .window()
    .should(function (win) {
        expect(win.localStorage.getItem('widgetDisplayed')).to.be.ok;
        expect(win.localStorage.getItem('widgetDisplayed')).to.eq('false');
    });
```

When the code decides not to show a widget we could have it write a value to localStorage, sessionStorage or the DOM so we know the decision has been taken. Otherwise we are forced to wait an abitary amount of time and assert negative which is a very flaky and slow practice.

## headers

```js
const resHeaders = res.headers;
const newAuth = resHeaders['set-cookie'].find((header) => {
    if (header.startsWith('auth=')) {
        return true;
    }
});
expect(newAuth).not.to.be.undefined;
expect(newAuth).not.to.contains(originalToken);
expect(response.headers).not.to.have.property('x-powered-by');
expect(response.headers).to.include({
    'cache-control': 'no-cache, no-store, must-revalidate',
});
```

## http convenience commands

See `commandsHttp.js` and `usages/http.js` for http convenience commands.

```js
cy.httpGet(`/test/path`, 200, 'Your account was created', 'Unexpected error');
cy.httpGetRetry(`/job/0`, 200, 'Lorem ipsum dolor', 5, 500);
```

## ignoring JavaScript errors

```js
Cypress.Commands.add('uncaughtException', () => {
    cy.on('uncaught:exception', (err, runnable) => {
        console.log(err);
        return false;
    });
});
```

## intercept and get response

```js
cy.intercept('POST', `${postPath}/*`).as('save');
cy.intercept('DELETE', `${deletePath}/*`).as('remove');
cy.wait('@save').its('response.statusCode').should('be.oneOf', [200, 201]);
```

## intercept and replace response

```js
data = { my: 'data' };

cy.intercept('GET', '/results', data).as('results');

cy.intercept('/path', {
    statusCode: 500,
});
```

## intercept and block unwanted requests

We want to stop calls to third party resources that we don't need for our tests. Helps the tests to run faster.

The blockHosts cypress.json config feature does not seem to work. So we need to use intercept.

See `commandsIntercept.js` and `usages/intercept.js` for blocking unwanted requests.

```js
cy.blockUnwantedRequests();
```

## local storage

```js
Cypress.Commands.add('getLocalStorage', (key) => {
    let value = localStorage.getItem(key);
    return cy.wrap(value);
});
```

## move cookies across domains

Grab the cookies from one domain and create them on another domain.

See `commandsCookies.js` and `usages/cookies.js` for moving cookies across domains.

```js
cy.stashCookies('myStash').then((cookies) => {
    cy.setCookiesOnDomain(cookies, 'www.totaljobs.com');
});
```

## stash cookies to local storage and unstash later

See `commandsCookies.js` and `usages/cookies.js` for stashing and unstashing cookies.

```js
cy.stashCookies('ourStash'); // stash the cookies and clear them
cy.unstashCookies('ourStash');
```

## Compare current cookies with stash to see which new cookies have been added

See `commandsCookies.js` and `usages/cookies.js` for finding newly added cookies.

```js
cy.unstashCookies('thisStash');
cy.setCookie('CONSENTMGR', 'consent:true');
cy.compareCookiesWithStash('thisStash').then((newCookies) => {});
```

## Save all localstorage to file using handle and restore it on a subsequent run (if handle exists)

See `commandsLocal.js` and `usages/local.js` for saving and restoring local storage.

```js
cy.restoreLocalStorage('totaljobs'); // will do nothing if handle does not exist - safe first run!
cy.saveLocalStorage('totaljobs');
```

## mochawesome

See `commandsCore.js` and `usages/coreMochawesome.js` for mochawesome.

Add the request url, response headers and response body to mochawesome.

```js
cy.requestAndReport('/api').then((response) => {
    expect(response.headers).to.have.property('content-type');
});
```

reportScreenshot - can be used multiple times in a single test

```js
cy.reportScreenshot('Before clicking submit');
```

Put a screenshot in the mochawesome report if the test fails.

At the top of the spec file call the utility function (outside of any `describe` or `context`).

```js
const util = require('../../util/util');
util.reportScreenshotOnFailure();
```

The function is defined in `util/util.js`.

Ensure `cypress.json` config file is correctly setup.

```js
  "screenshotOnRunFailure": true,
```

## multipart forms - new method

See `usages/multipart.js` for posting to a multipart form using the new method. Do not use arrow syntax!

## multipart forms - old method

See `commandsMultipart.js` and `usages/multipart.js` for posting to a multipart form using the old method.

## parse page html, parse page body text, parse source, parseresponse

See `commandsParse.js` and `usages/parse.js` for parsing the current page.

```js
cy.parsePageHtml('recent-([a-z]+)-container').then((parsed) => {
    expect(parsed).to.equal('search');
});
cy.parsePageText('Lorem ([a-z]+) dolor').then((parsed) => {
    expect(parsed).to.equal('ipsum');
});
```

## regular expressions

Return an array of matching first capture groups

```js
cy.parsePageAllMatches('([0-9]{7,10})').then((ids) => {
    expect(ids.length).to.be.greaterThan(0);
    cy.report(ids);
});
```

Parse job ids.

```js
cy.parseFirstJobId(myString);
```

```js
cy.parseAllJobIds(myString, leftDelimiter, rightDelimiter);
```

See `commandsParse.js` and `usages/parse.js` for the parsing single and multiple captures.

## should assertions

```html
<i class="material-icons">message</i>
```

```js
cy.get('html').should('contain', 'Enter your first name');
cy.get('body', { timeout: 5000 }).should('contain', 'TestCV.rtf');
cy.get('[class=material-icons]').should('contain', 'message');
cy.get('[data="info"]').should('not.exist');
cy.get('[data=item]').should('have.length.at.most', 12);
cy.get('[data=item]').should('have.length.greaterThan', 0);
cy.get('[data=item]').should('have.length.lessThan', 7);
cy.get('[data=item]').should('not.have.length', 0);
cy.get('[data=item]').first().should('be.visible');
cy.get('[data=item]').should('be.visible').should('contain', 'Please click here');
cy.get('[data=item]').first().should('have.css', 'max-width', '55%');
cy.get('[data=item]').first().should('have.attr', 'href').and('include', 'my-tab');
cy.getCookie('lang').should('have.property', 'value', 'fr');
cy.wait('@saved').its('response.statusCode').should('be.oneOf', [200, 201]);
cy.get('body').should('contain', 'MY_EXPECTED_TEXT');
cy.get('body').contains('cypress-service is up!').should('exist');
cy.url().should('contain', '/account/signin');
```

Caution - to check for elements not visible, the element could be present but not visible

```
cy.get('[data=item]').should('not.be.visible'); // invisible 1
```

Or perhaps the element will not exist at all

```
cy.get('[data=item]').should('not.exist'); // invisible 2
```

Note that with expect in some code structures the Cypress automatic retry does
not kick in - as in this example

```js
cy.window().then((win) => {
    win.scrollTo(0, 300);
    expect($el.offset().top).closeTo($el.offset().top, 300, 10);
    expect($el).to.be.visible;
});
```

If you wrap it in a should, it will now retry (double window technique!)

```js
cy.window()
    .window()
    .should(function (win) {
        win.scrollTo(0, 300);
        expect($el.offset().top).closeTo($el.offset().top, 300, 10);
        expect($el).to.be.visible;
    });
```

## soft assertions, fuzzy assertions

Use a regular expression if the css is out by a small fraction of a pixel

```js
cy.get('[data-testid="card-container"]')
    .first()
    .realHover()
    .invoke('css', 'box-shadow')
    .should('match', /rgba[(]0, 0, 0, 0[.]25[)] 0px 0px 5.*px 0px/);
```

```js
const fuzzyAssertion = new RegExp(`0px 16px (${someVariable}|32px)`);
cy.get('#applications').invoke('css', 'margin').should('match', fuzzyAssertion);
```

## removing \_blank target attribute from semantic link to stop new tab

See `usages/tab.js` for removing the \_blank target attribute from semantic links.

## stubbing links

```js
cy.window().then((win) => {
    cy.stub(win, 'open').as('redirect');
});
cy.get(`[data=item-that-opens-tab-and-redirects]`)
    .first()
    .click()
    .then(() => {
        cy.get('@redirect').then((redirect) => {
            expect(redirect.args[0][0]).not.to.be.empty;
            expect(redirect.args[0][0]).contains('/my/desired/redirect/path');
            expect(redirect.args[0][1]).to.equal('_blank');
            expect(redirect.args[0][2]).to.equal('noopener,noreferrer');
        });
    });
```

```js
Cypress.Commands.add('interceptReturnEmpty', (url) => {
    cy.intercept('GET', url, '').as('empty');
});
```

```js
cy.get(`[data="title"]`)
    .first()
    .then((title) => {
        cy.interceptReturnEmpty(title.get(0).getAttribute('href'));
    });

cy.get(`[data="title"]`).first().click();
```

## timeouts

```js
cy.get('[data=item]', { timeout: 30000 }).then(($el) => {});
```

## upload file and download file

Upload

```
npm install --save-dev cypress-file-upload
```

In `support/index.js`

```js
import 'cypress-file-upload';
```

```js
cy.intercept({
    method: /POST/,
    url: /api\/userData\/attachments/,
}).as('upload');

cy.contains('Upload icon').click();
cy.get('[type=file][name=file]').attachFile('MyCV.doc'); // target input element
cy.contains(/^Upload$/).click();
cy.wait('@upload');
```

Download

```js
cy.intercept({
    method: /GET/,
    url: /userData\/attachments/,
}).as('download');

cy.contains('Download icon').click();

cy.wait('@download');

const downloadsFolder = Cypress.config('downloadsFolder');
const filename = path.join(downloadsFolder, 'MyCV.doc');

cy.readFile(filename, 'utf8').then((content) => {
    expect(content).to.contain('DOCTESTCV');
});
```

Tidy up downloads folder at start of test

```js
Cypress.Commands.add('deleteDownloadsFolder', function () {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
});
```

In `plugins/index.js`

```js
const { rmdir } = require('fs');

module.exports = (on, config) => {
    on('task', {
        deleteFolder(folderName) {
            console.log('deleting folder %s', folderName);

            return new Promise((resolve, reject) => {
                rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error(err);

                        return reject(err);
                    }

                    resolve(null);
                });
            });
        },
    });
};
```

```js
cy.deleteDownloadsFolder();
```

## utility commands

Set baseurl for session and navigate to a fake page so you can set cookies / localstorage
before hitting a real url which might poison your desired start state.

```js
Cypress.Commands.add('setBaseUrl', (baseUrl) => {
    Cypress.config('baseUrl', baseUrl);
    const html = `<!DOCTYPE html><html><body><h1>Initialise Cypress to ${baseUrl}</h1></body></html>`;
    cy.intercept('GET', '/initialise_cypress_session.html', html);
    cy.visit('/initialise_cypress_session.html');
});
```

```js
cy.setBaseUrl('https://www.totaljobs.com');
```

See `commandsCore.js` and `usages/coreSetup.js`.

Write debug messages to a log file.

```js
Cypress.Commands.add('checkPoint', (script, message, options = {}) => {
    const init = options.hasOwnProperty('init') ? options.init : false;
    if (init) {
        cy.writeFile(`check/${script}.json`, { checks: [] }, 'utf8');
    }
    cy.readFile(`check/${script}.json`, 'utf8').then((contents) => {
        let checks = contents.checks;
        const date = new Date();
        const utc = date.toISOString();
        checks.push({ utc, message });
        cy.writeFile(`check/${script}.json`, { checks }, 'utf8');
    });
});
```

```js
cy.checkPoint('totaljobs', 'Starting script.', { init: true });
```

## utility functions

See `util/util.js` and `usages/util.js` for utility functions.

```js
function key() {
    const { v4: uuidv4 } = require('uuid');
    return uuidv4().substring(0, 8);
}
```

## verifypositive (against html source)

```js
Cypress.Commands.add('verifypositive', (regexString) => {
    cy.get('html:root')
        .eq(0)
        .invoke('prop', 'innerHTML')
        .then((doc) => {
            const regex = new RegExp(regexString, 'i');
            expect(doc).to.match(regex);
        });
});
```

```js
cy.verifypositive('Job ads');
```

## viewport

```js
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = subject[0].getBoundingClientRect();
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    return subject;
});
```

```js
cy.get('[data="results"]').scrollIntoView();
cy.get('[data=item]').then(($el) => {
    cy.get($el).isInViewport();
});
```

```js
Cypress.Commands.add('setViewport', (size) => {
    if (Cypress._.isArray(size)) {
        return cy.viewport(size[0], size[1]);
    } else {
        return cy.viewport(size);
    }
});
```

```js
cy.setViewport([1920, 780]);
```

## VIEWSTATE

Must have `form: true` property. Must escape VIEWSTATE.

```js
const util = require('../../util.js');

cy.request({
    method: 'GET',
    url: 'https://www.totaljobs.com/Authenticated/Unsubscribe.aspx',
    failOnStatusCode: true,
}).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.contains('You are about to close your jobseeker account');
    const VIEWSTATE = util.escape(util.parsetext('id="__VIEWSTATE" value="([^"]*)"', response.body));
    const VIEWSTATEGENERATOR = util.parsetext('id="__VIEWSTATEGENERATOR" value="([^"]*)"', response.body);
    cy.request({
        method: 'POST',
        body: `__VIEWSTATE=${VIEWSTATE}&__VIEWSTATEGENERATOR=${VIEWSTATEGENERATOR}&Keywords=Totaljobs+Group&LTxt=&LocationType=10&Keywords=Totaljobs+Group&LTxt=&LocationType=10&btnUnsubscribe=Close+my+account`,
        url: util.totaljobsBaseUrl() + '/Authenticated/Unsubscribe.aspx',
        failOnStatusCode: true,
        form: true,
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.contains('UnsubscribeConfirm');
    });
});

function parsetext(regexString, text) {
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

module.exports = {
    parsetext,
    escape,
};
```

## cy.waitUntil

```js
cy.waitUntil(() => cy.saveWithConfirm(id), { timeout: 30000, interval: 5000 });
```

```js
Cypress.Commands.add('saveWithConfirm', (id) => {
    cy.report(`Attempting to save id ${id} with boolean confirmation.`);
    cy.requestAndReport({
        url: `/save/${id}`,
        method: 'PUT',
        failOnStatusCode: false,
    }).then((res) => {
        // cannot do assertion, must manually check and return true or false for cypress-wait-until
        return cy.wrap(JSON.stringify(res.body).includes(id));
    });
});
```
