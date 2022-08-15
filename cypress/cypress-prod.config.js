const { defineConfig } = require('cypress');
const appRoot = require('app-root-path');

module.exports = defineConfig({
    chromeWebSecurity: false,

    env: {
        cwHost: 'https://www.cwjobs.co.uk',
        tjHost: 'https://www.totaljobs.com',
        platform: 'prod',
        name: 'prod',
    },

    screenshotsFolder: 'cypress/artifacts/prod',
    screenshotOnRunFailure: true,
    trashAssetsBeforeRun: false,

    userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36',

    e2e: {
        setupNodeEvents(on, config) {
            return require(`${appRoot}/cypress/plugins/index.js`)(on, config);
        },
        baseUrl: 'https://www.cwjobs.co.uk',
    },
});
