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

but it turned out Visual Studio Code automatically added this line to the top of `command.js`

```
const { expect } = require('chai');
```
