const helper = require('../helper/helper');

describe('Upload a file to a multipart form using cy.request', function () {
    it('Performs a multipart post to totaljobs.com', function () {
        const baseUrl = 'https://www.totaljobs.com';
        const postUrl = `${baseUrl}/Authenticated/profile.aspx`;

        helper.example_login(baseUrl);

        cy.request(postUrl).as('multipartForm'); // pretend we are doing the GET request for the multipart form

        const base64FileName = 'Base64TestCV.rtf';
        cy.fixture(base64FileName).as('base64File'); // file content in base64

        cy.get('@multipartForm').then((response) => {
            const body = response.body;
            expect(body).to.match(/Improve your chances of getting the job you want/);

            // Need to parse these values from the form
            // The form won't post if you don't post back the __VIEWSTATE and __VIEWSTATEGENERATOR
            // In addition __VIEWSTATEGENERATOR makes you post all the fields on the form, no more, no less
            const __VIEWSTATE = helper.parseForm('__VIEWSTATE', body);
            const __VIEWSTATEGENERATOR = helper.parseForm('__VIEWSTATEGENERATOR', body);

            const formData = new FormData();
            formData.append('candidateProfileDetails_ddlCurrentSalaryRate_SelectedValues', '2');
            formData.append('EducationValues', '');
            formData.append('__EVENTTARGET', '');
            formData.append('__EVENTARGUMENT', '');
            formData.append('candidateProfileDetails_eduEducation_ddlGrade_SelectedValues', '');
            formData.append('candidateProfileDetails_ddlDesiredSalaryRange_SelectedValues', '0');
            formData.append('__VIEWSTATE', __VIEWSTATE); // does not need to be escaped posting to multipart
            formData.append('__VIEWSTATEGENERATOR', __VIEWSTATEGENERATOR); // does not need to be escaped posting to multipart
            formData.append('Keywords', '');
            formData.append('LTxt', '');
            formData.append('LocationType', '10');
            formData.append('Keywords', '');
            formData.append('LTxt', '');
            formData.append('LocationType', '10');
            formData.append('candidateProfileDetails$ddlSalutation', 'Ms');
            formData.append('candidateProfileDetails$txtForename', 'Example');
            formData.append('candidateProfileDetails$txtSurname', 'Jobseeker');
            formData.append('candidateProfileDetails$txtHomePhone', '');
            formData.append('candidateProfileDetails$txtMobilePhone', '');
            formData.append('candidateProfileDetails$ddlCountryOfResidence', '1638');
            formData.append('candidateProfileDetails$txtPostCode', 'WC1X 8TG');
            formData.append('hasCloudCv', 'false');

            const postedFileName = 'TestCV.rtf';
            const mimeType = 'application/rtf';
            const blob = Cypress.Blob.base64StringToBlob(this.base64File, mimeType);
            formData.append('candidateProfileDetails$cvUpload$filCVUploadFile', blob, postedFileName);

            formData.append(
                'candidateProfileDetails$onlineProfileEntry$rptOnlineProfileEntry$ctl00$ddlOnlineProfileOptions',
                'NON',
            );
            formData.append(
                'candidateProfileDetails$onlineProfileEntry$rptOnlineProfileEntry$ctl00$txtOnlineProfile',
                '',
            );
            formData.append(
                'candidateProfileDetails$onlineProfileEntry$rptOnlineProfileEntry$ctl01$ddlOnlineProfileOptions',
                'NON',
            );
            formData.append(
                'candidateProfileDetails$onlineProfileEntry$rptOnlineProfileEntry$ctl01$txtOnlineProfile',
                '',
            );
            formData.append('candidateProfileDetails$rptIndustryExperience$ctl00$chkIndustrySector', 'on');
            formData.append('candidateProfileDetails$rptIndustryExperience$ctl02$chkIndustrySector', 'on');
            formData.append('candidateProfileDetails$ddlWorkExperience', '0');
            formData.append('candidateProfileDetails$txtCurrentJobTitle', 'Student');
            formData.append('candidateProfileDetails$ddlCurrentSalaryPeriod', '1');
            formData.append('candidateProfileDetails$ddlCurrentSalaryRate', '2');
            formData.append('candidateProfileDetails$ucNoticePeriod$ddlNoticePeriod', '4');
            formData.append('candidateProfileDetails$txtKeySkills', 'My new key skills');
            formData.append('candidateProfileDetails$ddlOtherLanguages', '0');
            formData.append('candidateProfileDetails_cbddlOtherLanguagestxt', '- Please select -');
            formData.append('candidateProfileDetails:cbddlOtherLanguages:0', '0');
            formData.append('candidateProfileDetails$ddlEducationLevel', '00');
            formData.append('candidateProfileDetails$ucGraduationYear$ddlGraduationYear', '0');
            formData.append('candidateProfileDetails$eduEducation$ddlQualType', '0');
            formData.append('institutionListType', 'on');
            formData.append('candidateProfileDetails$eduEducation$txtInstitution', '');
            formData.append('candidateProfileDetails$eduEducation$ddlInstitution', '');
            formData.append('candidateProfileDetails$eduEducation$ddlDiscipline', '0');
            formData.append('candidateProfileDetails$eduEducation$txtQualTitle', '');
            formData.append('candidateProfileDetails$eduEducation$ddlYearOfCompletion', '0');
            formData.append('candidateProfileDetails$eduEducation$ddlGrade', '0');
            formData.append('candidateProfileDetails$txtSummary', 'A brief summary');
            formData.append('candidateProfileDetails$txtJobTitle', 'Please, a job');
            formData.append('candidateProfileDetails$ddlDesiredLocation', '0');
            formData.append('candidateProfileDetails_cbddlLocationtxt', 'Willing to relocate');
            formData.append('candidateProfileDetails:cbddlLocation:0', '0');
            formData.append('candidateProfileDetails$initialDesiredLocation', '');
            formData.append('candidateProfileDetails$ddlRateType', '0');
            formData.append('candidateProfileDetails$initialDesiredSalaryRangeId', '0');
            formData.append('candidateProfileDetails$jtdDesiredTypeOfPosition', '0');
            formData.append('candidateProfileDetails_cbddljtdDesiredTypeOfPositiontxt', 'Any');
            formData.append('candidateProfileDetails:cbddljtdDesiredTypeOfPosition:0', '0');
            formData.append('candidateProfileDetails$jtdDesiredHours', '0');
            formData.append('candidateProfileDetails$ucEligibility$rptEligibility$ctl00$radListEligibility', '1');
            formData.append('candidateProfileDetails$ucEligibility$rptEligibility$ctl01$radListEligibility', '3');
            formData.append('candidateProfileDetails$Searchable', 'rdoNotSearchable');
            formData.append('btnSave', 'Save my profile');

            const method = 'POST';
            cy.multipartFormRequest(method, postUrl, formData, function (response) {
                expect(response.status).to.eq(200);
                expect(response.response).to.match(/Welcome back/); // Seems to follow redirects
            });
        });
    });
});
