const helper = require('../helper/helper');

// getCaptures('type="text/css" href="([^ ]+)"', html)
function getCaptures (regex, text) {
    let captures = [];
    let re = new RegExp(regex, 'g');
    let matches = re.exec(text);
    while (matches != null) {
        captures.push(matches[1]);
        matches = re.exec(text);
    }
    return captures;
}

describe('Download CV and check content', function () {
    it('Signs into Totaljobs with http', function () {

        const brand_url = 'https://www.totaljobs.com';
        helper.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';
        cy.request(account_url).then((response) => {
            const body = response.body;
            const __VIEWSTATE = getCaptures('id="__VIEWSTATE" value="([^"]+)"', body);
            console.log("My Viewstate: " + __VIEWSTATE);
        });

        // cy.request('/admin').its('body').should('include', 'MyCypressTestCV')
    })
})
