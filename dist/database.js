'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messages = exports.Message = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageSchema = new _mongoose.Schema({
    content: String,
    expires: Date,
    accesses: Number,
    maxAccesses: Number,
    creatorName: String,
    creatorId: Number,
    ipWhitelist: [String]
});

var Message = _mongoose2.default.model('Message', messageSchema);

var messages = function () {
    var isExpired = function isExpired(m) {
        return m.expires <= new Date() || m.accesses >= m.maxAccesses;
    };

    var deleteExpiredMessages = function deleteExpiredMessages() {
        Message.find({}, function (err, messages) {
            if (err) {
                console.log(err);
            }
            messages.forEach(function (m) {
                Message.remove({ _id: m._id }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Deleted expired message: ' + m);
                });
            });
        }).$where(function () {
            return isExpired(this);
        });
    };
    // Delete expired messages on startup.
    deleteExpiredMessages();

    // Delete expired messages every day.
    setTimeout(deleteExpiredMessages, 1000 * 60 * 60 * 24);

    return {
        findByCreatorId: function findByCreatorId(id, callback) {
            Message.find({ creatorId: id }, function (err, messages) {
                if (err) {
                    console.log(err);
                    callback();
                }
                messages.map(function (m) {
                    if (isExpired(m)) {
                        Message.remove({ _id: m._id }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
                callback(messages.filter(function (m) {
                    return !isExpired(m);
                }));
            });
        },
        findById: function findById(id, userIp, callback) {
            Message.findById(id, function (err, message) {
                if (err) {
                    console.log(err);
                    callback();
                } else if (!message) {
                    callback();
                } else if (isExpired(message)) {
                    Message.remove({ _id: message._id }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    callback();
                } else {
                    if (message.ipWhitelist && message.ipWhitelist.length > 0 && !message.ipWhitelist.find(function (ip) {
                        return ip === userIp;
                    })) {
                        // If there is a non-empty whitelist, and the user requesting to view the message is not on
                        // it, indicate they are forbidden from viewing it.
                        callback('forbidden');
                    } else {
                        message.accesses += 1;
                        message.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            callback(message);
                        });
                    }
                }
            });
        },
        insert: function insert(message, callback) {
            if (!message) {
                callback();
            } else if (message.content.length / 2 > 1024 * 1024) {
                // If the size of the content (which is an array of 16 bit, i.e. 2 byte chars) is over 1 mb, do not
                // put it in the database.
                callback();
            } else {
                message.expires = new Date(message.expires);
                var m = new Message(message);
                m.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                callback(m._id);
            }
        }
    };
}();

exports.Message = Message;
exports.messages = messages;
//# sourceMappingURL=database.js.map