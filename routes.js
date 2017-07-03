(() => {
    "use strict";

    const express = require('express');
    const router = express.Router();

    const db = (() => {
        const isExpired = m => m.expires >= new Date() || m.accesses >= m.maxAccesses;
        const store = {};
        let id = 0;
        return {
            findById: id => {
                const message = store[id];
                message.accesses += 1;
                if (isExpired(message)) {
                    delete store[id];
                    return undefined;
                }
                return message;
            },
            insert: message => {
                message.id = id;
                store[id] = message;
                id += 1;
                console.log(store);
                return message.id;
            }
        };
    })();

    router.post('/', (req, res) => {
        const id = db.insert({
            content: req.body.content,
            expires: req.body.expires,
            accesses: 0,
            maxAccesses: req.body.maxAccesses || 1
        });
        res.send(`${id}`);
    });

    router.get('/:id', (req, res) => {
        const m = db.findById(req.params.id);
        res.send(m ? `<p>${m.content}</p>` : "<p>That message doesn't exist.</p>");
    });

    module.exports.router = router;
})();