const { defineConfig } = require('cypress');
const appRoot = require('app-root-path');

module.exports = defineConfig({
    chromeWebSecurity: false,
    defaultCommandTimeout: 15000,
    env: {
        cwHost: 'https://www.cwjobs.co.uk',
        tjHost: 'https://www.totaljobs.com',
        platform: 'dev',
        name: 'blue-team',
    },
    retries: {
        runMode: 2,
        openMode: 0,
    },
    headless: true,
    pageLoadTimeout: 15100,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'cypress/results/dev',
        overwrite: false,
        html: false,
        json: true,
    },
    requestTimeout: 15200,
    responseTimeout: 15300,
    screenshotsFolder: 'cypress/artifacts/dev',
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: false,
    userAgent: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.4606.54 Safari/537.36 ${process.env.UA_SUFFIX}`,
    video: false,
    viewportHeight: 1600,
    viewportWidth: 1920,
    watchForFileChanges: false,
    e2e: {
        setupNodeEvents(on, config) {
            return require(`${appRoot}/cypress/plugins/index.js`)(on, config);
        },
        baseUrl: 'https://www.cwjobs.co.uk',
    },
});
