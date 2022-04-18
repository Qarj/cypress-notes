Cypress.Commands.add('getElementConsistently', (elem) => {
    let prevElem = {};
    for (let i = 0; i < 3; i++) {
        cy.get(elem).then(($e) => {
            if (shallowEqual(prevElem, $e)) {
                cy.log('Element is consistent');
            } else {
                cy.log('Element is not consistent');
            }
            prevElem = $e;
        });
        cy.wait(100);
    }
    cy.get(elem).then(($elem) => {
        return cy.wrap($elem);
    });
});

function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
}
