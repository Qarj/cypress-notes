# Challenges

- [x] 01 - Log into Totaljobs
- [x] 02 - Log into Totaljobs with http, then get profile with a browser
- [x] 03 - Log into CWJobs or Totaljobs by changing baseUrl
- [x] 04 - Two test specs requiring login share login code
- [x] 05 - Test type other than integration - Release
- [ ] 06 - Click on `Apply to jobs` in iframe at /Authenticated/MyApplications.aspx#/dashboard/applications
- [x] 07 - Create an account, filling out every profile field, uploading a CV file, close account
- [x] 08 - Download file, assert against the content
- [x] 09 - Helper - accept cookies
- [x] 10 - Blocker add-in to Chrome to prevent loading of unwanted third party resources slowing down tests

# Setup

```
npm i
```

# Run challenge headlessly

```
npx cypress run
```

# Run through Chrome

```
npx cypress run --browser chrome
```

# Challenge 1

Cypress fails test automatically due to some uncaught JavaScript exception that we don't care about.

```
npx cypress run --spec cypress/integration/challenge_01.js
```

# Solution 1

In `cypress/support/index.js` add the following code to ignore exceptions

```JavaScript
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
```


# Challenge 2

Cannot use JSON to build post body - there are two `Form.RememberMe` fields with exactly the same name.

Both need to be post but JSON will lose one of them.

```
npx cypress run --spec cypress/integration/challenge_02.js
```

# Solution 2

Build post body as a string.

In the solution we do not follow redirect automatically, however it will work either way.


# Challenge 3

Use the same test spec against different web sites (environments).

```
export CYPRESS_BASE_URL=https://www.totaljobs.com
npx cypress run --spec cypress/integration/challenge_03.js
```

# Solution 3

Set the baseUrl in the cypress.json file
```JavaScript
    "baseUrl": "https://www.cwjobs.co.uk"
```

Access as follows
```
        let baseUrl = Cypress.config().baseUrl;
```

Override as follows
```JavaScript
export CYPRESS_BASE_URL=https://www.totaljobs.com
```


# Challenge 4 

Multiple tests need to login as the same user.

```
npx cypress run --spec cypress/integration/challenge_04.js
```

# Solution 4

Create a function in a `helper` folder and export it
```JavaScript
module.exports = {
    example_login
}
```

Import it in the test
```JavaScript
const login = require('../helper/example_login')
```

And use as follows
```JavaScript
    login.example_login(brand_url);
```


# Challenge 5

Test organisation - test specs in folders according to their type.

```
npx cypress run --spec cypress/integration/release/challenge_05.js
```

# Solution 5

Unfortunately Cypress only looks in `cypress/integration` which is a bit silly since you are
forced to specify that even though it won't work anywhere else. The solution is to create
subfolders under integration.


# Challenge 6 Access iframe with different super domain

Access an iframe with a different super domain.

```
npx cypress run --spec cypress/integration/challenge_06.js
```

# Solution 6

Need to set turn off Chrome web security in `cypress.json`.

```JavaScript
    "chromeWebSecurity": false
```

Also need to update to Cypress 5.5.0.

While we find the iframe, it doesn't load.


# Challenge 7

Register a new user including CV Upload and selecting fields in drop downs. Close the account.

```
npx cypress run --spec cypress/integration/challenge_07.js --browser chrome
```

# Solution 7

Cypress does not yet have native support for uploading regular files. However you can upload
a file with base 64 content. The file will be converted to the correct content during the
upload by Cypress. So when we download the `Base64TestCV.rtf` from the website, it will
correctly contain rich text format mark up instead of base 64.

To upload a file, place it in the `cypress/fixtures` folder and convert the content to base 64
using an online converter like https://www.base64encode.org/ 


# Challenge 8

Sign in, download the profile CV and assert against the CV content.

# Solution 8

The account page where you can download the CV requires the .NET `__VIEWSTATE` and
`__VIEWSTATEGENERATOR` fields to be posted back. These fields need to be escaped even
though in the html source they are not escaped.

Cypress does not allow us to easily access data parsed from a previous response and
pass it to the next test step - you are expected to chain one request to the next
leading to a lot of indenting and hard to read code.

To mitigate this to some extent you can alias a response from one step then refer to that
in the next. This allows us to have a separate code block per request.

Do the request and store the response in account
```JavaScript
    cy.request(account_url).as('account');
```

Refer to the response in the subsequent step (we need to pull out the `__VIEWSTATE`)
```JavaScript
    cy.get('@account').then((response) => {
```


# Challenge 9

Cookie consent takes up a lot of screenshot space so we should automatically add the
consent cookie.

```
npx cypress run --spec cypress/integration/challenge_09.js
```

# Solution 9

We set a cookie as follows
```JavaScript
    cy.setCookie('CONSENTMGR', CONSENTMGR);
```

Then ensure that the cookie banner does not show
```JavaScript
    cy.get('body').contains('This site uses cookies').should('not.exist');
```


# Challenge 10

Cypress waits for third party resources to load even though we don't need to test them.

Load a Chrome extension to block requests to unneeded third party resources. 

```
npx cypress run --spec cypress/integration/challenge_10.js --browser chrome
```

# Solution 10

Load the extenion in `cypress/plugins/index.js` as follows
```JavaScript
module.exports = (on, config) => {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
            // NOTE: extensions cannot be loaded in headless Chrome
            launchOptions.extensions.push(`${__dirname}/../../extensions/blocker`); // absolute path
            return launchOptions
        }
        return launchOptions;
    })
}
```

Without blocker
```
Run 1: 12 seconds
Run 2: 12 seconds
Run 3: 19 seconds
Run 4: 19 seconds
Run 5: 19 seconds
```

With blocker
```
Run 1:  5 seconds
Run 2:  6 seconds
Run 3:  5 seconds
Run 4: 11 seconds
Run 5: 5 seconds
```


# Appendix - Stop tracking video file

```
git update-index --skip-worktree challenges/cypress/videos/challenge_01.js.mp4
```

