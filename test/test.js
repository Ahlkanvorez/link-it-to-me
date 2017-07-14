'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

const app = require('../dist/index.js');

describe('GET /auth/login', function () {
    it('Returns status code 200 (Ok)', function () {
        chai.request(app)
            .get('/auth/login')
            .send()
            .then(function (res) {
                expect(res).to.have.status(200);
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Redirects to an authentication page on google.com', function () {
        chai.request(app)
            .get('/auth/login')
            .send()
            .then(function (res) {
                expect(res).to.redirect;
                expect(res).to.redirectTo(/google\.com/);
            }).catch(function (err) {
                throw err;
            }
        );
    });
});

describe('GET /auth/google/callback', function () {
    it('Returns status code 401 (Unauthorized)', function () {
        chai.request(app)
            .get('/auth/google/callback')
            .send()
            .then(function (res) {
                expect(res).to.have.status(401);
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Redirects to /auth/login', function () {
        chai.request(app)
            .get('/auth/google/callback')
            .send()
            .then(function (res) {
                expect(res).to.redirect;
                expect(res).to.redirectTo('/auth/login');
            }).catch(function (err) {
                throw err;
            }
        );
    })
});

describe('GET /auth/logout', function () {
    it('Returns status code 200 (Ok)', function () {
        chai.request(app)
            .get('/auth/logout')
            .send()
            .then(function (res) {
                expect(res).to.have.status(200);
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Redirects to /', function () {
        chai.request(app)
            .get('/auth/logout')
            .send()
            .then(function (res) {
                expect(res).to.redirect;
                expect(res).to.redirectTo('/');
            }).catch(function (err) {
                throw err;
            }
        );
    });
});