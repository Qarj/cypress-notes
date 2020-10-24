# Challenges

01 - Log into Totaljobs
02 - Log into Totaljobs with http, then get profile with a browser
03 - Log into CWJobs or Totaljobs by changing baseUrl
04 - Two test files requiring login share single http login session
05 - Test type other than integration - Release
06 - Click on `Apply to jobs` in iframe at /Authenticated/MyApplications.aspx#/dashboard/applications
07 - Create an account, filling out every profile field, uploading a CV, close account
08 - Download CV from profile, run an assert against the content
09 - Automatically add cookies accepted cookie

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

# Solution 2

Build post body as a string.

In the solution we do not follow redirect automatically, however it will work either way.


# Appendix - Stop tracking video file

```
git update-index --skip-worktree challenges/cypress/videos/challenge_01.js.mp4
```

