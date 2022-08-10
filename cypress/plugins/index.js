/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const fs = require('fs-extra');
const { rmdir } = require('fs');
const screenshotNotFound =
    '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';

module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        console.log('launching browser %s is headless? %s', browser.name, browser.isHeadless);

        // the browser width and height we want to get
        // our screenshots and videos will be of that resolution
        const width = 1920;
        const height = 1080;

        console.log('setting the browser window size to %d x %d', width, height);

        if (browser.name === 'chrome' && browser.isHeadless) {
            launchOptions.args.push(`--window-size=${width},${height}`);

            // force screen to be non-retina and just use our given resolution
            launchOptions.args.push('--force-device-scale-factor=1');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
            // might not work on CI for some reason
            launchOptions.preferences.width = width;
            launchOptions.preferences.height = height;
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
            launchOptions.args.push(`--width=${width}`);
            launchOptions.args.push(`--height=${height}`);
        }

        if (browser.family === 'chromium' && browser.name !== 'electron') {
            // NOTE: extensions cannot be loaded in headless Chrome
            launchOptions.extensions.push(`${__dirname}/../../extensions/blocker`); // absolute path
        }

        // CI can have problems with gpu acceleration; examples of this are
        //    - libva error: vaGetDriverNameByIndex() failed with unknown libva error, driver_name = (null)
        //    - ERROR:sandbox_linux.cc(377)] InitializeSandbox() called with multiple threads in process gpu-process
        //    - ERROR:gpu_memory_buffer_support_x11.cc(44)] dri3 extension not supported.
        if (browser.isHeadless)
            if (browser.family === 'chromium') {
                launchOptions.args.push('--disable-gpu');
                launchOptions.args.push('--disable-software-rasterizer');
                launchOptions.args.push('--no-sandbox');
                console.log('Setting chromium family launch options to disable gpu, software rasterizer, and sandbox.');
            }

        return launchOptions;
    });

    on('task', {
        log(message) {
            console.log(message);

            return null;
        },

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

        readFileMaybe({ filename, defaultContent }) {
            if (fs.existsSync(filename)) {
                return fs.readFileSync(filename, 'utf8');
            }

            return defaultContent;
        },

        readScreenshotMaybe(filename) {
            filename = determineScreenshotPath(filename);
            console.log(`Resolved screenshot path ${filename}`);
            if (fs.existsSync(filename)) return fs.readFileSync(filename, 'base64');

            return screenshotNotFound;
        },

        isFile(filename) {
            if (fs.existsSync(filename)) {
                return true;
            }

            return false;
        },

        deleteFile(filename) {
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
                return true;
            }
            return false;
        },
    });
};

function determineScreenshotPath(supposedPath) {
    const supposedPathNoExt = supposedPath.slice(0, -4);

    function testPath(attempt) {
        if (attempt < 0) return supposedPath;

        let attemptSuffix = ` (attempt ${attempt}).png`;
        if (attempt === 0) attemptSuffix = '.png';
        const tryPath = supposedPathNoExt + attemptSuffix;

        if (fs.existsSync(tryPath)) return tryPath;
        return testPath(attempt - 1);
    }

    const maxPossibleAttempts = 5; // Cypress will try, then retry up to a max of 4 times
    return testPath(maxPossibleAttempts);
}
