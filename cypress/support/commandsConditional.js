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

Cypress.Commands.add('clickLocatorIfConsistentlyVisible', function (locator) {
    cy.isLocatorConsistentlyVisible(locator).then((result) => {
        if (result) {
            cy.log('Going to attempt click.');
            cy.get(locator).click();
        }
    });
});

Cypress.Commands.add('isLocatorConsistentlyVisible', function (locator) {
    cy.isLocatorVisible(locator).then((result) => {
        if (!result) return cy.wrap('');
        cy.wait(1000);
        cy.isLocatorVisible(locator).then((result) => {
            return cy.wrap(result);
        });
    });
});

Cypress.Commands.add('isLocatorVisible', function (locator) {
    cy.get('body').then(($body) => {
        const result = $body.find(locator);
        if (result.length > 0) {
            cy.log('Logging locator as found.');
            cy.log(`${result}`);
            cy.get(locator).then(($el) => {
                if ($el.is(':visible')) {
                    cy.log('Locator is visible.');
                    //you get here only if button EXISTS and is VISIBLE
                    return cy.wrap(result);
                } else {
                    cy.log('Locator is not visible.');
                }
            });
        }
        return cy.wrap('');
    });
});
