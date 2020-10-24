# Challenge

Cypress fails test automatically due to some uncaught JavaScript exception that we don't care about.

# Solution

In `cypress/support/index.js` add the following code to ignore exceptions

```JavaScript
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
```

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

# Appendix - Stop tracking video file

```
git update-index --skip-worktree challenges/challenge_01/cypress/videos/challenge_01.js.mp4
```
