(() => {
    "use strict";

    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const messages = require('./database.js').messages;

    router.get('/view/:id', (req, res) => {
        messages.findById(req.params.id, m => {
            res.json({ message: m });
        });
    });

    router.post('/', (req, res) => {
        messages.insert({
            content: req.body.content,
            expires: req.body.expires,
            accesses: 0,
            maxAccesses: req.body.maxAccesses || 1
        }, id => {
            res.json({ id: id });
        });
    });

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build', 'index.html'));
    });

    module.exports.router = router;
})();