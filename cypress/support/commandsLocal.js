// In `plugins/index.js` to define readFileMaybe task for restoreLocalStorage

// const fs = require('fs');
// module.exports = (on, config) => {
//     // `on` is used to hook into various events Cypress emits
//     // `config` is the resolved Cypress config
//     on('task', {
//         readFileMaybe({ filename, defaultContent }) {
//             if (fs.existsSync(filename)) {
//                 return fs.readFileSync(filename, 'utf8');
//             }

//             return defaultContent;
//         },
//     });
// };

Cypress.Commands.add('saveLocalStorage', function (handle = 'default') {
    cy.log(`Saving localstorage for ${handle}...`).then(() => {
        let items = [];
        for (var i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(localStorage.key(i));
            items.push({ key, value });
            cy.log(`key: ${key}, value: ${value}`);
        }
        cy.writeFile(`state/${handle}_local_storage.json`, { items }, 'utf8');
        cy.log('Done saving localstorage.');
    });
});

Cypress.Commands.add('restoreLocalStorage', function (handle = 'default') {
    cy.log(`Restoring local storage for ${handle} ...`);
    const filename = `state/${handle}_local_storage.json`;
    const defaultContent = JSON.stringify({ items: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const items = contents.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            localStorage.setItem(item.key, item.value);
            cy.log(`key: ${item.key}, value: ${item.value}`);
        }
    });
    cy.log('Done restoring localstorage.');
});
