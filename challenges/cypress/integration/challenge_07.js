const helper = require('../helper/helper')

describe('Account management', function () {
    it('Creates and closes Totaljobs account', function () {
        cy.visit('https://www.totaljobs.com/account/register');
        helper.accept_cookies();

        cy.get('[name=firstname]').type('Test');

        cy.get('[name=surname]').type('Account');

        cy.get('[name=email]').type('test-account@example.com');

        cy.fixture('Base64TestCV.rtf').as('cv');

        cy.get('input[name=localCv]').then(function(el) {
            // convert the logo base64 string to a blob
            const blob = Cypress.Blob.base64StringToBlob(this.cv, 'application/octet-stream')

            const file = new File([blob], 'Base64TestCV.rtf', { type: 'application/octet-stream' })
            const list = new DataTransfer()

            list.items.add(file)
            const myFileList = list.files

            el[0].files = myFileList
            el[0].dispatchEvent(new Event('change', { bubbles: true }))
        })

    })
})
