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
        creatorId: Number
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
                    callback(messages);
                });
            },
            findById: (id, callback) => {
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
                        message.accesses += 1;
                        message.save(err => {
                            if (err) {
                                console.log(err);
                            }
                            callback(message.content);
                        });
                    }
                });
            },
            insert: (message, callback) => {
                if (!message) {
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