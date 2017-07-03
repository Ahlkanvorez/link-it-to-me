(() => {
    "use strict";

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Files for the compiled React app.
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.use(require('./routes.js').router);

    const port = 3001;
    console.log(`Listening on port ${port}`);
    app.listen(port);
})();