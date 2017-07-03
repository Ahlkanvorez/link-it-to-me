(() => {
    "use strict";

    const express = require('express');
    const router = express.Router();
    const messages = require('./database.js').messages;

    router.post('/', (req, res) => {
        messages.insert({
            content: req.body.content,
            expires: req.body.expires,
            accesses: 0,
            maxAccesses: req.body.maxAccesses || 1
        }, id => {
            res.send(`${id}`);
        });
    });

    router.get('/:id', (req, res) => {
        console.log(req.params.id);
        messages.findById(req.params.id, m => {
            res.send(m ? `<p>${m}</p>` : "<p>That message doesn't exist.</p>");
        });
    });

    module.exports.router = router;
})();