const helper = require('../helper/helper');

describe('Download CV and check content', function () {
    it('Signs into Totaljobs with http', function () {

        const brand_url = 'https://www.totaljobs.com';
        helper.example_login(brand_url);

        const account_url = brand_url + '/Authenticated/Default.aspx';

        cy.request(account_url).as('account');

        cy.get('@account').then((response) => {
            const body = response.body;

            const __VIEWSTATE = helper.parseForm('__VIEWSTATE', body);
            const __VIEWSTATEGENERATOR = helper.parseForm('__VIEWSTATEGENERATOR', body);

            let postBody = new helper.BodyBuilder();
            postBody.push ('__EVENTTARGET', 'ctl00%24lnkDownloadCV');
            postBody.push ('__EVENTARGUMENT', '');
            postBody.push ('__VIEWSTATE', __VIEWSTATE, true );
            postBody.push ('__VIEWSTATEGENERATOR', __VIEWSTATEGENERATOR, true);
            for (let i = 0; i < 2; i++) {
                postBody.push ('Keywords', 'Test Automation Engineer', true);
                postBody.push ('LTxt', '');
                postBody.push ('LocationType', '10');
            }
            postBody.push ('jobseekerProfile$SearchableOptions$Searchable', 'rdoNotSearchable');
            postBody.push ('jobseekerProfile$SearchableOptions$chkApplicationMatching', 'on');
            postBody.push ('SLSOptions$SLSOptions', 'rdoOn');
            postBody.push ('SLSOptions$ddlMaxEmails', '10');

            cy.request({
                method: 'POST',
                url: account_url,
                followRedirect: false,
                form: true,
                body: postBody.body()
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.contain('MyCypressTestCV');
            } )

        })

    })
})
