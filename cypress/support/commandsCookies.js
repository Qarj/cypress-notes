Cypress.Commands.add('stashCookies', (name = 'default') => {
    cy.getCookies().then((cookies) => {
        localStorage.setItem(`${name}_CookiesStash`, JSON.stringify(cookies));
        cy.clearCookies();
        return cy.wrap(cookies);
    });
});

Cypress.Commands.add('unstashCookies', (name = 'default') => {
    const cookies = JSON.parse(localStorage.getItem(`${name}_CookiesStash`));
    for (let i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expiry,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
        });
    }
    return cy.wrap(cookies);
});

Cypress.Commands.add('setCookiesOnDomain', (cookies, domain) => {
    cookies.map((cookie) => {
        cy.setCookie(cookie.name, cookie.value, {
            domain: domain,
        });
    });
});

Cypress.Commands.add('compareCookiesWithStash', (name = 'default') => {
    cy.report(`Comparing cookies with stash ${name}`);
    const stashCookies = JSON.parse(localStorage.getItem(`${name}_CookiesStash`));
    let newCookies = [];
    cy.getCookies().then((cookies) => {
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if (!cookieExists(cookie, stashCookies)) {
                cy.report(`Found new cookie ${cookie.name}`);
                newCookies.push(cookie);
            }
        }
    });
    cy.log();
    return cy.wrap(newCookies);
});

function cookieExists(targetCookie, cookies) {
    let cookieFound = false;
    for (let i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (cookie.name === targetCookie.name) {
            cookieFound = true;
            break;
        }
    }
    return cookieFound;
}
