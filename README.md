# cypress-notes

Notes on using Cypress.io

# Setup the challenges and run through GUI

```
cd challenges
npm i
npx cypress open
```

# Create a new Cypress project

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

# When npm install thinks cypress is installed but it isn't

```
npx cypress install
```

# Start Cypress / initialise

```
npx cypress open
node_modules/.bin/cypress open
```

# Run headlessly using electron

```
npx cypress run
```

# Run one spec file

```
npx cypress run --spec cypress/integration/challenge_02.js
```

# Run through various browsers headfully

```
npx cypress run --browser chrome
npx cypress run --browser chromium
npx cypress run --browser firefox
npx cypress run --browser edge
npx cypress run --browser electron --headed
```

# Show currently installed cypress version

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

# Remove clear windows app data in case of corruption

```
npx cypress open
```

File -> View App Data

Delete everything in the cy folder (typically found at `C:\Users\<user>\AppData\Roaming\cypress\cy\`)

# Show installed versions of cypress

```
npx cypress cache list
```

# Remove all but current installed versions of cypress

```
npx cypress cache prune
```

# Remove all installed versions of cypress

```
npx cypress cache clear
```

# Troubleshooting Error: ENOENT: no such file or directory, stat '/initrd.img'

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

# cypress.json

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

# test structure

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

# checking links

```js
it('Should have href attribute in the header arrow linking to MyColours', () => {
    cy.visit('/widgets');
    cy.get('[data-testid=title-arrow]').should('have.attr', 'href').and('include', 'MyColours.aspx');
    cy.get('[data-testid=title-arrow]').should('have.attr', 'target', '_blank');
});
```

# cy.get

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
```

partial class name match

```
cy.get('*[class^="convai-widget-button"]').as('convaiButton');
```

# cy.get then find to drill down into DOM

In this example, we get the recommender widget then find the job within that widget, then the unsaved job within that ignoring other widgets

```js
cy.get('[data-component="component-RecommendedJobs"]')
    .find('[id="job-item-55667788"]')
    .find('[data-testid="unsavedjob-icon-star"]')
    .click({ scrollBehavior: 'center' });
```

# cy.request

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

# cookies

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

# expect assertions

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

cy.visit('/my/feature/')
    .window()
    .should(function (win) {
        expect(win.localStorage.getItem('widgetDisplayed')).to.be.ok;
        expect(win.localStorage.getItem('widgetDisplayed')).to.eq('false');
    });
```

When the code decides not to show a widget we could have it write a value to localStorage, sessionStorage or the DOM so we know the decision has been taken. Otherwise we are forced to wait an abitary amount of time and assert negative which is a very flaky and slow practice.

# headers

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

# httpGet convenience command

```js
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
    });
});

cy.httpGet(`/test/path`, 200, 'Your account was created', 'Unexpected error');
```

# httpGetRetry - retry a http get request a number of times using recursion - for async database processes

```js
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

cy.httpGetRetry(`/test/path`, 200, `Your order details`);
```

# ignoring JavaScript errors

```js
cy.on('uncaught:exception', (err, runnable) => {
    return false;
});
```

# intercept and get response

```js
cy.intercept('POST', `${postPath}/*`).as('save');
cy.intercept('DELETE', `${deletePath}/*`).as('remove');
cy.wait('@save').its('response.statusCode').should('be.oneOf', [200, 201]);
```

# intercept and replace response

```js
data = { my: 'data' };

cy.intercept('GET', '/results', data).as('results');

cy.intercept('/path', {
    statusCode: 500,
});
```

# intercept and block unwanted requests

The blockHosts cypress.json config feature does not seem to work. So we need to use intercept.

```js
Cypress.Commands.add('blockUnwantedRequests', () => {
    blockDomain('www.bat.bing');
    blockDomain('tags.tiqcdn.com');
    blockDomain('.*tealiumiq.com');
    blockDomain('.*doubleclick.net');
    blockDomain('.*go-mpulse.net');
    blockDomain('apis.google.com');
    blockDomain('.*omtrdc.net');
    blockPath('performancelogger');
});
function blockDomain(domain) {
    let regex = new RegExp('https://' + domain + '.*', 'is');
    cy.intercept(regex, '');
}
function blockPath(path) {
    let regex = new RegExp('.*' + path + '.*', 'is');
    cy.intercept(regex, '');
}
```

# local storage

```js
Cypress.Commands.add('getLocalStorage', (key) => {
    let value = localStorage.getItem(key);
    return value;
});

Cypress.Commands.add('setCookiesOnDomain', (cookies, domain) => {
    cookies.map((cookie) => {
        cy.setCookie(cookie.name, cookie.value, {
            domain: domain,
        });
    });
});
```

Grab the cookies from one domain and create them on another domain.

```js
cy.getCookies().then((cookies) => {
    localStorage.setItem('myCookiesStash', JSON.stringify(cookies));
});

cy.getLocalStorage('myCookiesStash').then((cookies) => {
    cy.setCookiesOnDomain(JSON.parse(cookies), 'my.new.domain');
});
```

# mochawesome

Add the request url, response headers and response body to mochawesome.

```js
const addContext = require('mochawesome/addContext');
Cypress.Commands.add('requestAndReport', (request) => {
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
```

```js
cy.requestAndReport('/path').then((response) => {
    expect(response.headers).to.have.property('x-custom-header');
});
```

Report a comment in mochawesome

```js
Cypress.Commands.add('report', (text) => {
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
```

```js
cy.report('Hey there!');
```

# multipart forms

```js
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

const postedFileName = 'myFile.zip';
const baseUrl = Cypress.config().baseUrl;
const postUrl = `${baseUrl}/path/to/multipart/form`;
const base64FileName = `${postedFileName}.base64`; // base64 myFile.zip > myFile.zip.base64 (place in fixtures)

// do the GET request for the multipart form
cy.request(postUrl).as('multipartForm');

// specify the zip file we are posting in base64 format
cy.fixture(base64FileName).as('base64File');

cy.get('@multipartForm').then((response) => {
    const formData = new FormData();
    formData.append('version', version); // append all the regular non file fields

    const mimeType = 'application/zip';
    const blob = Cypress.Blob.base64StringToBlob(this.base64File, mimeType);
    formData.append('uploadFile', blob, postedFileName);

    let expectedStatusCode = 201;
    let expectedMessage = 'unzipped ok';

    // Do the multipart form post
    cy.multipartFormRequest('POST', postUrl, formData, function (response) {
        // Cypress does not fail on the expects inside the callback
        // expect(response.status).to.eq(expectedStatusCode);
        // also can access response.response
    });
});
```

# parse text, parse html source, parseresponse

```js
Cypress.Commands.add('parsetext', (regexString) => {
    cy.get('html').then(($html) => {
        const text = $html.text();
        const regex = new RegExp(regexString);
        if (regex.test(text)) {
            const match = text.match(regex);
            console.log(`Match: ${match[1]}`);
            return match[1];
        } else {
            console.log('No matches could be found.');
        }
        return '';
    });
});
```

```js
cy.get('html').should('contain', 'Enter your first name'); // make sure text is present first
cy.parsetext('Enter your ([a-z]+) name').then((result) => {
    cy.log(`Result: ${result}`);
});
```

```js
Cypress.Commands.add('parsesource', (regexString) => {
    cy.get('html:root')
        .eq(0)
        .invoke('prop', 'innerHTML')
        .then((doc) => {
            const regex = new RegExp(regexString);
            if (regex.test(doc)) {
                const match = doc.match(regex);
                console.log(`Match: ${match[1]}`);
                return match[1];
            } else {
                console.log('No matches could be found.');
            }
            return '';
        });
});
```

# regular expressions

Return an array of matching first capture groups

```js
Cypress.Commands.add('getJobIdsFromSearch', (schemeHost = '', keyword = 'manager') => {
    cy.request({
        url: `${schemeHost}/jobs/${keyword}`,
        failOnStatusCode: true,
        retryOnStatusCodeFailure: true,
        method: 'GET',
    }).then((response) => {
        expect(response.status).to.match(/(200|201)/);
        const regex = new RegExp(/"id":([\d]{7,10}),"title"/g);
        let jobIds = [];
        let result;
        while ((result = regex.exec(response.body)) !== null) {
            jobIds.push(result[1]); // 0 is full match, 1 is capture group 1
        }
        expect(jobIds.length).to.be.greaterThan(0);
        return cy.wrap(jobIds);
    });
});
```

# should assertions

```html
<i class="material-icons">message</i>
```

```js
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

If you wrap it in a should, it will now retry

```js
cy.window()
    .window()
    .should(function (win) {
        win.scrollTo(0, 300);
        expect($el.offset().top).closeTo($el.offset().top, 300, 10);
        expect($el).to.be.visible;
    });
```

# soft assertions, fuzzy assertions

Use a regular expression if the css is out by a small fraction of a pixel

```js
cy.get('[data-testid="card-container"]')
    .first()
    .realHover()
    .invoke('css', 'box-shadow')
    .should('match', /rgba[(]0, 0, 0, 0[.]25[)] 0px 0px 5.*px 0px/);
```

# stubbing links

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

# timeouts

```js
cy.get('[data=item]', { timeout: 30000 }).then(($el) => {});
```

# verifypositive (against html source)

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

# viewport

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

# VIEWSTATE

Must have `form: true` property. Must escape VIEWSTATE.

```js
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
```
