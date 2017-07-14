'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

const app = require('../dist/index.js');

describe('GET /auth/login', function () {
    it('redirects to a google authentication page.', function () {
        chai.request(app)
            .get('/auth/login')
            .send()
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.redirect;
                expect(res).to.redirectTo(/google\.com/);
            }).catch(function (err) {
                throw err;
            }
        );
    });
});
