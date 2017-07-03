(() => {
    "use strict";

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');

    const MongoClient = require('mongodb').MongoClient;
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Files for the compiled React app.
    app.use(express.static(path.join(__dirname, 'client/build')));

    let links;
    MongoClient.connect('mongodb://localhost:27017/link_it_to_me', (err, db) => {
        // A link is expired if it has a defined date which is at or before the current moment, or it has been viewed
        // more times than the max number of allowed viewings.
        const expired = link => (!link.expires && link.expires <= new Date()) || link.timesAccessed >= link.maxAccesses;

        links = {
            get: (code, callback) => {
                if (!code || !callback) {
                    return;
                }
                db.collection('links').find({ code: code }).toArray((err, docs) => {
                    if (err) {
                        console.log(err);
                    }
                    if (docs && docs[0]) {
                        const link = docs[0];

                        if (expired(link)) {
                            db.collection('links').deleteOne({ code: code }, (err, result) => {
                                if (err) {
                                    console.log(err)
                                }
                            });
                            callback();
                        } else {
                            db.collection('links').updateOne({ code: code }, {
                                $set: { timesAccessed: link.timesAccessed + 1 }
                            }, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            callback(link.target);
                        }
                    } else {
                        callback();
                    }
                });
            },
            insert: (link, callback) => {
                if (!link || !callback) {
                    return;
                }
                db.collection('links').insertOne(link, (err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                    if (doc) {
                        callback(doc);
                    } else {
                        callback();
                    }
                });
            }
        }
    });

    app.post('/link/:code', (req, res) => {
        if (!req.params.code) {
            res.send('<h1>Something went wrong ...</h1><p>We cannot make a link without a code.</p>');
        }
        links.get(req.params.code, link => {
            if (link) {
                res.send('<h1>Sorry</h1><p>A link with that code already exists.</p>');
            } else if (!req.body.target) {
                res.send('<h1>Sorry</h1><p>A link has to have a target.</p>');
            } else {
                links.insert({
                    code: req.params.code,
                    expires: new Date(req.body.expires),
                    target: req.body.target,
                    timesAccessed: req.body.timesAccessed || 0,
                    maxAccesses: req.body.maxAccesses || 1
                }, doc => {
                    res.redirect(doc.target);
                });
            }
        });
    });

    app.get('/link/:code', (req, res) => {
        links.get(req.params.code, link => {
            if (link) {
                res.redirect(link);
            } else {
                res.send("<h1>Sorry</h1><p>It looks like that link doesn't exist.</p>");
            }
        });
    });

    const port = 3001;
    console.log(`Listening on port ${port}`);
    app.listen(port);
})();