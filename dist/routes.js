'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _database = require('./database.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// For a good tutorial on passport.js, see:
// - https://cloud.google.com/nodejs/getting-started/authenticate-users
// Note: the above tutorial does not make it clear that this authentication
// method requires both the Google+ Api and the Contacts Api be enabled.

// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
var authRequired = function authRequired(req, res, next) {
    if (!req.user) {
        req.session.oauth2return = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
};

var addTemplateVariables = function addTemplateVariables(req, res, next) {
    res.locals.profile = req.user;
    res.locals.login = '/auth/login?return=' + encodeURIComponent(req.originalUrl);
    res.locals.logout = '/auth/logout?return=' + encodeURIComponent(req.originalUrl);
    next();
};

router.get('/auth/login', function (req, res, next) {
    // If applicable, save the URL from which the user is navigating to login,
    // to return after logging in.
    if (req.query.return) {
        req.session.oauth2return = req.query.return;
    }
    next();
}, _passport2.default.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', _passport2.default.authenticate('google'), function (req, res) {
    var origin = req.session.oauth2return || '/user';
    delete req.session.oauth2return;
    res.redirect(origin);
});

router.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/message/:id', function (req, res) {
    var userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log(`Ip (${userIp}) attempted to view message by id:
    //   ${req.params.id}`);
    _database.messages.findById(req.params.id, userIp, function (m) {
        if (m === 'forbidden') {
            res.render('forbidden');
        } else if (!m || !m.content) {
            res.redirect(req.user ? '/user' : '/');
        } else {
            res.json({
                content: m.content,
                creator: m.creatorName || 'Anonymous'
            });
        }
    });
});

router.get('/view/:id', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '/../view_client/build/', 'index.html'));
});

router.get('/messages', authRequired, addTemplateVariables, function (req, res) {
    _database.messages.findByCreatorId(req.user.id, function (messages) {
        res.json({
            username: req.user.displayName,
            messages: messages
        });
    });
});

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/user', authRequired, addTemplateVariables, function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '/../client/build/', 'index.html'));
});

// Same as the user panel, only it doesn't display a list of messages, because
// no one is logged in.
router.get('/guest', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '/../client/build/', 'index.html'));
});

router.post('/', function (req, res) {
    _database.messages.insert({
        content: req.body.content,
        expires: req.body.expires,
        accesses: 0,
        maxAccesses: req.body.maxAccesses || 1,
        creatorName: req.user && req.user.displayName || 'Anonymous',
        // Let 0 be the ID for Anonymous users.
        creatorId: req.user && req.user.id || 0,
        ipWhitelist: req.body.ipWhitelist || []
    }, function (id) {
        if (!id) {
            res.json({
                content: 'Sorry, that message is too long; it cannot be over ' + '3000 characters in length.'
            });
        } else {
            res.json({
                id: id,
                content: req.body.content
            });
        }
    });
});

module.exports.router = router;