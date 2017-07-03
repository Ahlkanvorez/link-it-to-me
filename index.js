(() => {
    "use strict";

    const express = require('express');
    const path = require('path');

    const app = express();

    // Files for the compiled React app.
    app.use(express.static(path.join(__dirname, 'client/build')));

    const codes = {
        get: (code) => {
            if (!code) {
                return undefined;
            }
            const link = this[code];
            if (link.timesAccessed >= link.maxAccesses || link.expires <= new Date()) {
                this[code] = undefined;
                return undefined;
            }
            return link;
        },
        'google': {
            expires: new Date(2017, 7, 3, 10, 10, 30),
            target: 'https://www.google.com',
            timesAccessed: 0,
            maxAccesses: 4
        }
    };

    app.get('/link/:code', (req, res) => {
        console.log(req.params);
        const link = codes.get(req.params.code);
        if (link) {
            res.redirect(link.target);
        } else {
            res.send("<h1>Sorry</h1><p>It looks like that link doesn't exist.</p>");
        }
    });

    const port = 3001;
    console.log(`Listening on port ${port}`);
    app.listen(port);
})();