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
                // The redirect URL must be to the root: i.e., the domain, an optional port, then /
                expect(res.redirects[0]).to.match(/[^/]+(?::[0-9]+)?\/$/);
            }).catch(function (err) {
                throw err;
            }
        );
    });
});

describe('GET /message/:id', function () {
    // Create two messages: one can be viewed, the other can't.
    let accessibleMessageId, inaccessibleMessageId;
    before(function () {
        chai.request(app)
            .post('/')
            .send({
                content: 'This is a test message.',
                expires: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
                maxAccesses: 1
            }).then(function (res) {
                accessibleMessageId = res.body.id;
            }).catch(function (err) {
                throw err;
            }
        );

        chai.request(app)
            .post('/')
            .send({
                content: 'This is a test message with an IP whitelist that blocks everyone.',
                expires: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
                maxAccesses: 5,
                ipWhitelist: ['Nobody']
            }).then(function (res) {
                inaccessibleMessageId = res.body.id;
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Returns status code 200', function () {
        chai.request(app)
            .get(`/message/${inaccessibleMessageId}`)
            .send()
            .then(function (res) {
                expect(res).to.have.status(200);
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Redirects to / if it does not exist', function () {
        chai.request(app)
            .get('/message/0')
            .send()
            .then(function (res) {
                expect(res).to.redirect;
                // The redirect URL must be to the root: i.e., the domain, an optional port, then /
                expect(res.redirects[0]).to.match(/[^/]+(?::[0-9]+)?\/$/);
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Renders a "forbidden" page when requested by an IP not on the whitelist', function () {
        chai.request(app)
            .get(`/message/${inaccessibleMessageId}`)
            .send()
            .then(function (res) {
                expect(res).to.be.html;
            }).catch(function (err) {
                throw err;
            }
        );
    });

    it('Returns JSON with content and creator members for a valid id, and self-destructs on last view', function () {
        chai.request(app)
            .get(`/message/${accessibleMessageId}`)
            .send()
            .then(function (res) {
                expect(res).to.be.json;
                expect(res.body).to.have.property('content');
                expect(res.body).to.have.property('creator');
                chai.request(app)
                    .get(`/message/${accessibleMessageId}`)
                    .send()
                    .then(function (res) {
                        expect(res).to.redirect;
                        expect(res.redirects[0]).to.match(/[^/]+(?::[0-9]+)?\/$/);
                    }).catch(function (err) {
                        throw err;
                    }
                );
            }).catch(function (err) {
                throw err;
            }
        );
    });
});
