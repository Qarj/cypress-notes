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
npm init
npm install cypress --save-dev
```

Create a `.gitignore` file

```
node_modules/
videos/
screenshots/
```

# When npm install thinks cypress is install but it isn't

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

# Show installed versions of cypress

```
npx cypress cache list
```

# Remove all installed versions of cypress

```
npx cypress cache clear
```

