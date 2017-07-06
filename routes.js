(() => {
    "use strict";

    const express = require('express');
    const passport = require('passport');
    const router = express.Router();
    const path = require('path');
    const messages = require('./database.js').messages;

    // For a good tutorial on passport.js, see:
    // - https://cloud.google.com/nodejs/getting-started/authenticate-users
    // Note: the above tutorial does not make it clear that this authentication method requires both the
    // Google+ Api and the Contacts Api be enabled.

    // Middleware that requires the user to be logged in. If the user is not logged
    // in, it will redirect the user to authorize the application and then return
    // them to the original URL they requested.
    const authRequired = (req, res, next) => {
        if (!req.user) {
            req.session.oauth2return = req.originalUrl;
            return res.redirect('/auth/login');
        }
        next();
    };

    const addTemplateVariables = (req, res, next) => {
        res.locals.profile = req.user;
        res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
        res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
        next();
    };

    router.get('/auth/login', (req, res, next) => {
        // If applicable, save the URL from which the user is navigating to login, to return after logging in.
        if (req.query.return) {
            req.session.oauth2return = req.query.return;
        }
        next();
    }, passport.authenticate('google', { scope: ['email', 'profile'] }));

    router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        const origin = req.session.oauth2return || '/admin';
        delete req.session.oauth2return;
        res.redirect(origin);
    });

    router.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // TODO: consider requiring authentication to view a link.
    router.get('/view/:id', (req, res) => {
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(userIp);
        messages.findById(req.params.id, m => {
            if (!m || !m.content) {
                res.redirect(req.user ? '/admin' : '/');
            } else if (m.ipWhitelist && m.ipWhitelist.length > 0 && !m.ipWhitelist.find(ip => ip === userIp)) {
                // If there is a non-empty whitelist, and the user requesting to view the message is not on it, redirect
                // them to a page telling them they lack access.
                res.render('forbidden');
            } else {
                res.render('message', {
                    content: m.content,
                    creator: m.creatorName || 'Anonymous'
                });
            }
        });
    });

    router.get('/messages', authRequired, addTemplateVariables, (req, res) => {
        messages.findByCreatorId(req.user.id, messages => {
            res.json({
                username: req.user.displayName,
                messages: messages
            });
        });
    });

    router.get('/', (req, res) => {
        res.render('index');
    });

    router.get('/admin', authRequired, addTemplateVariables, (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build/', 'index.html'));
    });

    router.post('/', authRequired, (req, res) => {
        messages.insert({
            content: req.body.content,
            expires: req.body.expires,
            accesses: 0,
            maxAccesses: req.body.maxAccesses || 1,
            creatorName: req.user.displayName || 'Anonymous',
            creatorId: req.user.id,
            ipWhitelist: req.body.ipWhitelist || []
        }, id => {
            res.json({
                id: id,
                content: req.body.content
            });
        });
    });

    module.exports.router = router;
})();