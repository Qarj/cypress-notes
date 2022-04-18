Cypress.Commands.add('parsePageText', (regexString) => {
    cy.get('html').then(($html) => {
        const text = $html.text();
        const regex = new RegExp(regexString);
        if (regex.test(text)) {
            const match = text.match(regex);
            console.log(`Match: ${match[1]}`);
            return cy.wrap(match[1]);
        } else {
            console.log('No matches could be found.');
        }
        return cy.wrap('');
    });
});

Cypress.Commands.add('parsePageHtml', (regexString) => {
    cy.get('html:root')
        .eq(0)
        .invoke('prop', 'innerHTML')
        .then((doc) => {
            const regex = new RegExp(regexString);
            if (regex.test(doc)) {
                const match = doc.match(regex);
                console.log(`Match: ${match[1]}`);
                return cy.wrap(match[1]);
            } else {
                console.log('No matches could be found.');
            }
            return cy.wrap('');
        });
});

Cypress.Commands.add('getJobIdsFromSearch', (schemeHost = '', keyword = 'manager') => {
    cy.request({
        url: `${schemeHost}/jobs/${keyword}`,
        failOnStatusCode: true,
        retryOnStatusCodeFailure: true,
        method: 'GET',
    }).then((response) => {
        expect(response.status).to.match(/(200|201)/);
        const regex = new RegExp(/"id":([\d]{7,10}),"title"/g);
        let jobIds = [];
        let result;
        while ((result = regex.exec(response.body)) !== null) {
            jobIds.push(result[1]); // 0 is full match, 1 is capture group 1
        }
        expect(jobIds.length).to.be.greaterThan(0);
        return cy.wrap(jobIds);
    });
});

Cypress.Commands.add('parsePageAllMatches', (regexString) => {
    let matches = [];
    cy.get('html:root')
        .eq(0)
        .invoke('prop', 'innerHTML')
        .then((doc) => {
            const regex = new RegExp(`${regexString}`, 'g');
            let result;
            while ((result = regex.exec(doc)) !== null) {
                matches.push(result[1]); // 0 is full match, 1 is capture group 1
            }
        });

    return cy.wrap(matches);
});

Cypress.Commands.add('parseFirstJobId', (text) => {
    const regex = new RegExp(/([\d]{7,10})/);
    if (regex.test(text)) {
        const match = text.match(regex);
        return cy.wrap(match[1]);
    } else {
        cy.log('No job ids could be found.');
    }
    return cy.wrap('');
});

Cypress.Commands.add('parseAllJobIds', (text, leftDelim = '', rightDelim = '') => {
    const regex = new RegExp(`${leftDelim}([\\d]{7,10})${rightDelim}`, 'g');
    let jobIds = [];
    let result;
    while ((result = regex.exec(text)) !== null) {
        jobIds.push(result[1]); // 0 is full match, 1 is capture group 1
    }
    return cy.wrap(jobIds);
});
