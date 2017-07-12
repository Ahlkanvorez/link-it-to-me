'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth20');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require('./routes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _helmet2.default)());

// For a good tutorial on passport.js, see:
// - https://cloud.google.com/nodejs/getting-started/authenticate-users
// Note: the above tutorial does not make it clear that this authentication method requires both the
// Google+ Api and the Contacts Api be enabled.

//const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Synchronously load client id & secret from conf.json, to preserve order of initialization.
var conf = JSON.parse(_fs2.default.readFileSync('conf.json'));

var extractProfile = function extractProfile(profile) {
    var imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl
    };
};

_passport2.default.use(new _passportGoogleOauth.Strategy({
    clientID: conf['google-client-id'],
    clientSecret: conf['google-client-secret'],
    callbackURL: conf['google-oauth-callback'],
    accessType: 'offline'
}, function (accessToken, refreshToken, profile, callback) {
    callback(null, extractProfile(profile));
}));

_passport2.default.serializeUser(function (user, callback) {
    callback(null, user);
});

_passport2.default.deserializeUser(function (obj, callback) {
    callback(null, obj);
});

var mongoUri = conf['mongo-uri'];
_mongoose2.default.Promise = global.Promise; // enable a non-deprecated promise library.
_mongoose2.default.connect(mongoUri);

app.use(function (req, res, next) {
    req.db = _mongoose2.default.connection;
    next();
});

app.use((0, _expressSession2.default)({
    resave: false,
    saveUninitialized: false,
    secret: conf['session-secret'],
    signed: true
}));
app.set('view engine', 'pug');
app.set('trust proxy', true);
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use('/', _routes.router);

// Files for the compiled React app.
app.use(_express2.default.static(_path2.default.join(__dirname, '/../client/build')));
app.use(_express2.default.static(_path2.default.join(__dirname, '/../view_client/build')));

// Basic 404 handler
app.use(function (req, res) {
    res.status(404).send('Not Found');
});

// Basic error handler
app.use(function (err, req, res) {
    console.error(err);
    // If our routes specified a specific response, then send that. Otherwise,
    // send a generic message so as not to leak anything.
    res.status(500).send(err.response || 'Something broke!');
});

var port = 3001;
console.log('Listening on port ' + port);
app.listen(port);
