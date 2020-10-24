# cypress-notes
Notes on using Cypress.io

# Create new Cypress project

```
mkdir challenges
cd challenges
npm init
npm init
npm install cypress --save-dev
```

Create a `.gitignore` file

```
node_modules/
videos/
screenshots/
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

# Run through various browsers headfully

```
npx cypress run --browser chrome
npx cypress run --browser chromium
npx cypress run --browser firefox
npx cypress run --browser edge
npx cypress run --browser electron --headed
```
