(() => {
    "use strict";

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const messageSchema = new Schema({
        content: String,
        expires: Date,
        accesses: Number,
        maxAccesses: Number,
        creatorName: String,
        creatorId: Number,
        ipWhitelist: [String]
    });

    const Message = mongoose.model('Message', messageSchema);
    module.exports.Message = Message;

    module.exports.messages = (() => {
        const isExpired = m => (m.expires <= new Date() || m.accesses >= m.maxAccesses);

        return {
            findByCreatorId: (id, callback) => {
                Message.find({ creatorId: id }, (err, messages) => {
                    if (err) {
                        console.log(err);
                        callback();
                    }
                    messages.map(m => {
                        if (isExpired(m)) {
                            Message.remove({ _id: m._id }, err => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                    callback(messages.filter(m => !isExpired(m)));
                });
            },
            findById: (id, userIp, callback) => {
                Message.findById(id, (err, message) => {
                    if (err) {
                        console.log(err);
                        callback();
                    } else if (!message) {
                        callback();
                    } else if (isExpired(message)) {
                        Message.remove({ _id : message._id }, err => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        callback();
                    } else {
                        if (message.ipWhitelist && message.ipWhitelist.length > 0 && !message.ipWhitelist.find(ip => ip === userIp)) {
                            // If there is a non-empty whitelist, and the user requesting to view the message is not on
                            // it, indicate they are forbidden from viewing it.
                            callback('forbidden');
                        } else {
                            message.accesses += 1;
                            message.save(err => {
                                if (err) {
                                    console.log(err);
                                }
                                callback(message);
                            });
                        }
                    }
                });
            },
            insert: (message, callback) => {
                if (!message) {
                    callback();
                } else if (message.content.length / 2 > 1024 * 1024) {
                    // If the size of the content (which is an array of 16 bit, i.e. 2 byte chars) is over 1 mb, do not
                    // put it in the database.
                    callback();
                } else {
                    message.expires = new Date(message.expires);
                    const m = new Message(message);
                    m.save(err => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    callback(m._id);
                }
            }
        };
    })();
})();