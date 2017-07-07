import express from 'express';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import fs from 'fs';
import mongoose from 'mongoose';
import { router } from './routes.js';

const app = express();

app.use(helmet());

// For a good tutorial on passport.js, see:
// - https://cloud.google.com/nodejs/getting-started/authenticate-users
// Note: the above tutorial does not make it clear that this authentication method requires both the
// Google+ Api and the Contacts Api be enabled.

//const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Synchronously load client id & secret from conf.json, to preserve order of initialization.
const conf = JSON.parse(fs.readFileSync('conf.json'));

const extractProfile = profile => {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl
    };
};

passport.use(new GoogleStrategy({
    clientID: conf['google-client-id'],
    clientSecret: conf['google-client-secret'],
    callbackURL: conf['google-oauth-callback'],
    accessType: 'offline'
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, extractProfile(profile));
}));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((obj, callback) => {
    callback(null, obj);
});

const mongoUri = conf['mongo-uri'];
mongoose.Promise = global.Promise; // enable a non-deprecated promise library.
mongoose.connect(mongoUri);

app.use((req, res, next) => {
    req.db = mongoose.connection;
    next();
});

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: conf['session-secret'],
    signed: true
}));
app.set('view engine', 'pug');
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router);

// Files for the compiled React app.
app.use(express.static(path.join(__dirname, '/../client/build')));

// Basic 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res) => {
    console.error(err);
    // If our routes specified a specific response, then send that. Otherwise,
    // send a generic message so as not to leak anything.
    res.status(500).send(err.response || 'Something broke!');
});

const port = 3001;
console.log(`Listening on port ${port}`);
app.listen(port);