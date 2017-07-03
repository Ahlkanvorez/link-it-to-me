(() => {
    "use strict";

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');
    const router = require('./routes.js').router;

    const app = express();

    const mongoose = require('mongoose');
    const mongoUri = 'mongodb://localhost:27017/link_it_to_me';
    mongoose.connect(mongoUri);

    app.use((req, res, next) => {
        req.db = mongoose.connection;
        next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', router);

    // Files for the compiled React app.
    app.use(express.static(path.join(__dirname, 'client/build')));

    const port = 3001;
    console.log(`Listening on port ${port}`);
    app.listen(port);
})();