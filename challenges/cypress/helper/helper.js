function example_login (brand_url) {
    // Cannot use JSON since two Form.RememberMe need to be posted, one will be lost
    const postbody = 'Form.Email=example_jobseeker@example.com&Form.Password=example1&Form.RememberMe=true&Form.RememberMe=false';

    const signin_url = brand_url + '/account/signin';

    cy.request({
        method: 'POST',
        url: signin_url,
        followRedirect: false,
        form: true,
        body: postbody
    }).then((response) => {
        expect(response.status).to.eq(302)
    } );
}

function accept_cookies () {
    const CONSENTMGR = 'c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1603662984214%7Cconsent:true';
    cy.setCookie('CONSENTMGR', CONSENTMGR);
}

function parseForm (name, text) {
    let value = parseResponse (`name="${name}"[^>]+value="([^"]+)"`, text);
    if (value === '') {
        value = parseResponse (`value="([^"]+)"[^>]+name="${name}"`, text);
    }
    return value;
}

// parseResponse
// return the first matching capture or empty string if not found
// example: parseResponse('type="text/css" href="([^ ]+)"', text)
function parseResponse (regex, text) {
    let capture = '';
    const re = new RegExp(regex, 'g');
    let matches = re.exec(text);
    if (matches != null) {
        capture = matches[1];
    }
    return capture;
}

class BodyBuilder { 
    constructor(height, width) { 
        this.fields = []; 
    }

    push (name, value, escape = false) {
        if (escape) {
            value = value.replace(/ /g, "%20");
            value = value.replace(/\\/g, "%22");
            value = value.replace(/\$/g, "%24");
            value = value.replace(/&/g, "%24");
            value = value.replace(/'/g, "%27");
            value = value.replace(/\+/g, "%2B");
            value = value.replace(/\//g, "%2F");
            value = value.replace(/</g, "%3C");
            value = value.replace(/>/g, "%3E");
        }
        return this.fields.push (`${name}=${value}`) ;
    }

    body () {
        let build = '';
        this.fields.forEach(function(entry) { build += entry + '&'});
        return build.slice(0, -1);
    }
}


module.exports = {
    example_login,
    accept_cookies,
    parseForm,
    parseResponse,
    BodyBuilder
}
