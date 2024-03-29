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
    cy.isLocatorConsistentlyVisible(locator).then((isVisible) => {
        if (isVisible) {
            cy.log('Locator is consistently visible, going to attempt click.');
            cy.get(locator).click();
        } else {
            cy.log('Locator is not consistently visible, not going to attempt click.');
        }
    });
});

Cypress.Commands.add('isLocatorConsistentlyVisible', function (locator) {
    cy.isLocatorVisible(locator).then((isVisible) => {
        if (!isVisible) return cy.wrap(false);
        else {
            cy.log('Locator is visible, waiting 1 second to see if it stays visible.');
            cy.wait(1000);
            cy.isLocatorVisible(locator).then((isStillVisible) => {
                return cy.wrap(isStillVisible);
            });
        }
    });
});

Cypress.Commands.add('isLocatorVisible', function (locator) {
    const { inspect } = require('util');
    cy.get('body').then(($body) => {
        const result = $body.find(locator);
        if (result.length > 0) {
            cy.log('Logging locator as found.');
            cy.log(inspect(result, { showHidden: false, depth: null }));
            cy.get(locator).then(($el) => {
                if ($el.is(':visible')) {
                    cy.log('Locator is visible.');
                    //you get here only if button EXISTS and is VISIBLE
                    return cy.wrap(true);
                } else {
                    cy.log('Locator is not visible.');
                }
            });
        } else {
            cy.log(`Locator ${locator} is not found.`);
            return cy.wrap(false);
        }
    });
});

Cypress.Commands.add('clickTextIfConsistentlyPresent', function (text) {
    cy.isTextConsistentlyPresent(text).then((result) => {
        if (result) {
            cy.log('Going to attempt contains click.');
            cy.contains(text).click();
        }
    });
});

Cypress.Commands.add('isTextConsistentlyPresent', function (text) {
    cy.isTextPresent(text).then((result) => {
        if (!result) return cy.wrap(result);
        else {
            cy.wait(1000);
            cy.isTextPresent(text).then((result) => {
                return cy.wrap(result);
            });
        }
    });
});

Cypress.Commands.add('isTextPresent', function (text) {
    cy.log('Executing isTextPresent: ' + text);
    cy.get('body').then(($body) => {
        if ($body.text().includes(text)) {
            cy.log(`Found ${text} present in body.`);
            return cy.wrap(true);
        } else {
            cy.log(`${text} NOT FOUND in body.`);
            return cy.wrap(false);
        }
    });
});

Cypress.Commands.add('isTextConsistentlyVisibleInElement', function (text, element) {
    cy.isTextVisibleInElement(text, element).then((result) => {
        if (!result) return cy.wrap(result);
        else {
            cy.wait(1500);
            cy.isTextVisibleInElement(text, element).then((result) => {
                return cy.wrap(result);
            });
        }
    });
});

Cypress.Commands.add('isTextVisibleInElement', function (text, element) {
    cy.waitForTextVisibleInElementToStabilise(element);
    cy.log(`Executing isTextVisibleInElement ${text} in ${element}`);
    cy.get(element);
    const visibleText = Cypress.$(`${element} *:not(:has(*)):visible`).text();
    cy.log(`Visible text: ${visibleText}`);
    if (visibleText.includes(text)) {
        cy.log(`Found ${text} in element ${element}.`);
        return cy.wrap(true);
    } else {
        return cy.wrap(false);
    }
});

Cypress.Commands.add('waitForTextVisibleInElementToStabilise', function (element) {
    cy.log(`Executing waitForTextVisibleInElementToStabilise in ${element}`);

    let oldVisibleText = '__initialised__';
    let attempts = 0;
    const maxAttempts = 10;

    const waitStabilise = function () {
        attempts++;
        if (attempts > maxAttempts) return cy.log(`Max attempts reached, text did not stabilise`);
        cy.get(element);
        const visibleText = Cypress.$(`${element} *:not(:has(*)):visible`).text();
        cy.log(`Current visible text: ${visibleText}`);
        if (visibleText === oldVisibleText) return cy.log(`Visible text has stabilised.`);
        oldVisibleText = visibleText;
        cy.wait(1001).then(() => {
            waitStabilise();
        });
    };

    waitStabilise();
});
