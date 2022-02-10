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
    cy.saveAllCookies(`${handle}_cookies`);
    cy.saveAllLocalStorage(`${handle}_localStorage`);
    cy.saveAllSessionStorage(`${handle}_sessionStorage`);
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
    cy.restoreAllCookies(`${handle}_cookies`);
    cy.restoreAllLocalStorage(`${handle}_localStorage`);
    cy.restoreAllSessionStorage(`${handle}_sessionStorage`);
});
