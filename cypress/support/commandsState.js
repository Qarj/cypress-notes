// plugins/index.js

// ```js
// const fs = require('fs');
// module.exports = (on, config) => {
//     on('task', {
//         readFileMaybe({ filename, defaultContent }) {
//             if (fs.existsSync(filename)) {
//                 return fs.readFileSync(filename, 'utf8');
//             }

//             return defaultContent;
//         },
//     });
// };
// ```

//
// All state
//

Cypress.Commands.add('saveAllCookies', function (handle) {
    cy.log(`Saving all cookies to ${handle}.json ...`);
    cy.getCookies().then((cookies) => {
        let allCookies = [];
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            allCookies.push(cookie);
            cy.dumpCookie(cookie);
        }
        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allCookies }, 'utf8');
    });
    cy.log('Done saving cookies.');
});

Cypress.Commands.add('restoreAllCookies', function (handle) {
    cy.log(`Restoring all cookies from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allCookies: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allCookies = contents.allCookies;
        for (let i = 0; i < allCookies.length; i++) {
            var cookie = allCookies[i];
            cy.setCookie(cookie.name, cookie.value, {
                domain: cookie.domain,
                expiry: cookie.expiry,
                httpOnly: cookie.httpOnly,
                path: cookie.path,
                secure: cookie.secure,
            });
            cy.dumpCookie(cookie);
        }
    });
    cy.log('Done restoring cookies.');
});

Cypress.Commands.add('saveAllLocalStorage', function (handle) {
    cy.log(`Saving all local storage to ${handle}.json ...`).then(() => {
        let allLocal = [];
        const keys = Object.keys(localStorage);
        let i = keys.length;

        while (i--) {
            allLocal.push({
                nameFriendly: keys[i],
                name: toBase64(keys[i]),
                value: toBase64(localStorage.getItem(keys[i])),
            });
            cy.log(keys[i]);
        }

        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allLocal }, 'utf8');
    });
    cy.log('Done saving all local storage.');
});

Cypress.Commands.add('restoreAllLocalStorage', function (handle) {
    cy.log(`Restoring all local storage from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allLocal: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allLocal = contents.allLocal;
        for (let i = 0; i < allLocal.length; i++) {
            var item = allLocal[i];
            const name = fromBase64(item.name);
            const value = fromBase64(item.value);
            cy.log(name, value);
            localStorage.setItem(name, value);
        }
    });
    cy.log('Done restoring local storage.');
});

Cypress.Commands.add('saveAllSessionStorage', function (handle) {
    cy.log(`Saving all session storage to ${handle}.json ...`).then(() => {
        let allSession = [];
        const keys = Object.keys(sessionStorage);
        let i = keys.length;

        while (i--) {
            allSession.push({
                name: keys[i],
                value: toBase64(sessionStorage.getItem(keys[i])),
            });
            cy.log(keys[i]);
        }

        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allSession }, 'utf8');
    });
    cy.log('Done saving all session storage.');
});

Cypress.Commands.add('restoreAllSessionStorage', function (handle) {
    cy.log(`Restoring all session storage from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allSession: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allSession = contents.allSession;
        for (let i = 0; i < allSession.length; i++) {
            var item = allSession[i];
            const value = fromBase64(item.value);
            cy.log(item.name, value);
            sessionStorage.setItem(item.name, value);
        }
    });
    cy.log('Done restoring session storage.');
});

function toBase64(text) {
    return Buffer.from(text, 'utf16le').toString('base64');
}

function fromBase64(text) {
    return Buffer.from(text, 'base64').toString('utf16le');
}

Cypress.Commands.add('saveState', function (handle) {
    const env = Cypress.env('name');
    const lockPath = `state/${env}_${handle}-lock.json`;
    cy.createLock(lockPath);
    cy.saveAllCookies(`${env}_${handle}_cookies`);
    cy.saveAllLocalStorage(`${env}_${handle}_localStorage`);
    cy.saveAllSessionStorage(`${env}_${handle}_sessionStorage`);
    cy.releaseLock(lockPath);
});

Cypress.Commands.add('clearState', function () {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.report('Cleared state.');
});

Cypress.Commands.add('clearSessionStorage', function () {
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});

Cypress.Commands.add('restoreState', function (handle) {
    cy.clearState();
    const env = Cypress.env('name');
    const lockPath = `state/${env}_${handle}-lock.json`;
    cy.createLock(lockPath);
    cy.restoreAllCookies(`${env}_${handle}_cookies`);
    cy.restoreAllLocalStorage(`${env}_${handle}_localStorage`);
    cy.restoreAllSessionStorage(`${env}_${handle}_sessionStorage`);
    cy.releaseLock(lockPath);
});

Cypress.Commands.add('createLock', function (lockPath) {
    const maxAttempts = 10;
    let attempts = 0;
    function waitNoLock() {
        cy.task('isFile', lockPath).then((exists) => {
            if (attempts >= maxAttempts) return cy.log('Max attempts reached, giving up waiting for no lock.');
            if (exists) {
                cy.log(`Lock file exits ${lockPath} - waiting ...`);
                cy.wait(1000);
                attempts++;
                return waitNoLock();
            } else return;
        });
    }
    waitNoLock();
    cy.writeFile(lockPath, { lock: 'locked' }, 'utf8');
});

Cypress.Commands.add('releaseLock', function (lockPath) {
    cy.task('deleteFile', lockPath);
});

//
// Just the peristent cookies
//

Cypress.Commands.add('savePersistentCookies', function (handle) {
    cy.log('Saving cookies ...');
    cy.getCookies().then((cookies) => {
        let persistentCookies = [];
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if (cookie.expiry) {
                persistentCookies.push(cookie);
                cy.dumpCookie(cookie);
            }
        }
        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}_persistent_cookies.json`, { date: utc, persistentCookies }, 'utf8');
    });
    cy.log('Done saving cookies.');
});

Cypress.Commands.add('restorePersistentCookies', function (handle) {
    cy.log('Restoring cookies ...');
    const filename = `state/${handle}_persistent_cookies.json`;
    const defaultContent = JSON.stringify({ persistentCookies: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const persistentCookies = contents.persistentCookies;
        for (let i = 0; i < persistentCookies.length; i++) {
            var cookie = persistentCookies[i];
            cy.setCookie(cookie.name, cookie.value, {
                domain: cookie.domain,
                expiry: cookie.expiry,
                httpOnly: cookie.httpOnly,
                path: cookie.path,
                secure: cookie.secure,
            });
            cy.dumpCookie(cookie);
        }
    });
    cy.log('Done restoring cookies.');
});
