const helper = require('../helper/helper')

describe('Account management workflow including file upload', function () {
    it('Creates and closes Totaljobs account', function () {

        //
        // Register a new account
        //

        cy.visit('https://www.totaljobs.com/account/register');
        helper.accept_cookies();

        cy.get('[name=firstname]').type('Test');

        cy.get('[name=surname]').type('Account');

        cy.get('[name=email]').type('test-account@example.com');

        cy.fixture('Base64TestCV.rtf').as('cv'); // with base64 content!

        cy.get('input[name=localCv]').then(function(el) {
            // convert the rtf cv base64 string to a blob
            const blob = Cypress.Blob.base64StringToBlob(this.cv, 'application/octet-stream');

            const file = new File([blob], 'Base64TestCV.rtf', { type: 'application/octet-stream' });
            const list = new DataTransfer();

            list.items.add(file);
            const myFileList = list.files;

            el[0].files = myFileList;
            el[0].dispatchEvent(new Event('change', { bubbles: true }));
        })

        const educationDropDown = 'select[name=educationId]';
        cy.get(educationDropDown).should('contain', '- Please select -');
        cy.get(educationDropDown).select('0'); // selects value, not element text
        cy.get(educationDropDown).should('contain', 'None of these');

        cy.get('input[name=currentJobTitle]').type('Student');

        // We fill the form out of order to force the auto suggestions for the current job title to go away
        // since they are covering fields further down the form
        // A real user would need to click somewhere on the form to make the suggestions close
        cy.get('label[for=eligibilityUkYes]').click();
        cy.get('label[for=eligibilityEuYes]').click();

        cy.get('label[for=rdoDailyRate]').click();
        const salaryRangeDropDown = 'select[name=salaryRange]';
        cy.get(salaryRangeDropDown).should('contain', 'Select daily rate');
        cy.get(salaryRangeDropDown).select('28');
        cy.get(salaryRangeDropDown).should('contain', '40 to 47');

        cy.get('input[name=password]').type('example_pass_1');
        cy.get('input[name=confirmpassword]').type('example_pass_1');

        cy.get('input[id=cvdbOptIn]').click();
        cy.get('input[id=applicationHistoryOptIn]').click({multiple: true});
        cy.get('input[id=ocaOptIn]').click();

        cy.get('button[id=register]').click();


        //
        // Close the account
        //

        cy.visit('https://www.totaljobs.com/Authenticated/UserPreferences.aspx#CloseAccount');
        cy.get('a[id=lnkUnsubscribe]').click();
        cy.get('input[name=btnUnsubscribe]').click();

    })
})
