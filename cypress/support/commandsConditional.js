Cypress.Commands.add('assertContainsOrActionIfContains', (assertText, actionText, action, customTimeout = 0) => {
    let dynamicRegex = `(${assertText}|${actionText})`;
    let regexObj = new RegExp(dynamicRegex);
    if (customTimeout) {
        cy.contains(regexObj, { timeout: customTimeout });
    } else {
        cy.contains(regexObj);
    }
    cy.get('body').then(($body) => {
        if ($body.text().includes(actionText)) {
            cy.log('Action text found, performing conditional action.');
            action();
        } else {
            cy.log('Action text not found.');
        }
    });
});

Cypress.Commands.add('clickLocatorIfConsistentlyPresent', function (locator) {
    cy._findLocatorIfConsistentlyPresent(locator).then((result) => {
        if (result) {
            cy.log('Going to attempt click.');
            cy.get(locator).click();
        }
    });
});

Cypress.Commands.add('_findLocatorIfConsistentlyPresent', function (locator) {
    cy._findLocatorIfPresent(locator).then((result) => {
        if (!result) return cy.wrap('');
        cy.wait(1000);
        cy._findLocatorIfPresent(locator).then((result) => {
            return cy.wrap(result);
        });
    });
});

Cypress.Commands.add('_findLocatorIfPresent', function (locator) {
    cy.get('body').then(($body) => {
        const result = $body.find(locator);
        if (result.length > 0) {
            cy.log('Logging locator as found.');
            cy.log(`${result}`);
            return cy.wrap(result);
        }
        return cy.wrap('');
    });
});
