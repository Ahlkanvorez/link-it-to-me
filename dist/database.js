'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messages = exports.Message = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hash = function hash(text) {
    var h = _crypto2.default.createHash('sha256');
    h.update(String(text));
    return h.digest('hex');
};

var messageSchema = new _mongoose.Schema({
    hashedId: String,
    content: String,
    expires: Date,
    accesses: Number,
    maxAccesses: Number,
    creatorName: String,
    creatorId: Number,
    ipWhitelist: [String]
});

messageSchema.pre('save', function (next) {
    // Don't repeat unnecessary computations.
    if (!this.hashedId) {
        this.hashedId = hash(this._id);
    }
    next();
});

var Message = _mongoose2.default.model('Message', messageSchema);

var messages = function () {
    var isExpired = function isExpired(m) {
        return m.expires <= new Date() || m.accesses >= m.maxAccesses;
    };

    var deleteExpiredMessages = function deleteExpiredMessages() {
        Message.find({
            $or: [{ expires: { $lt: new Date() } }, { $where: function $where() {
                    return this.accesses >= this.maxAccesses;
                } }]
        }).then(function (messages) {
            messages.forEach(function (m) {
                Message.remove({ _id: m._id }).catch(function (err) {
                    return console.error(err);
                }).then(function () {
                    return console.log('Deleted expired message: ' + m);
                });
            });
        }).catch(function (err) {
            return console.error(err);
        });
    };
    // Delete expired messages on startup.
    deleteExpiredMessages();

    // Delete expired messages every day.
    setTimeout(deleteExpiredMessages, 1000 * 60 * 60 * 24);

    var exposeOnlyHashedId = function exposeOnlyHashedId(m) {
        m = m.toJSON();
        m.id = m.hashedId;
        m.hashedId = undefined;
        m._id = undefined;
        return m;
    };

    return {
        findByCreatorId: function findByCreatorId(id, callback) {
            Message.find({ creatorId: id }).then(function (messages) {
                messages.map(function (m) {
                    if (isExpired(m)) {
                        Message.remove({ _id: m._id }).catch(function (err) {
                            return console.error(err);
                        });
                    }
                });
                callback(messages.filter(function (m) {
                    return !isExpired(m);
                }).map(exposeOnlyHashedId));
            }).catch(function (err) {
                console.error(err);
                callback();
            });
        },
        findById: function findById(hashedId, userIp, callback) {
            Message.find({ hashedId: hashedId }).then(function (messages) {
                var message = messages[0];
                if (!message) {
                    callback();
                } else if (isExpired(message)) {
                    Message.remove({ _id: message._id }).catch(function (err) {
                        return console.error(err);
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
                        message.save().then(function () {
                            return callback(exposeOnlyHashedId(message));
                        }).catch(function (err) {
                            return console.error(err);
                        });
                    }
                }
            }).catch(function (err) {
                console.error(err);
                callback();
            });
        },
        insert: function insert(message, callback) {
            if (!message) {
                callback();
            } else if (message.content.length > 3000) {
                // If the message is over 3000 characters in length, don't put it in the database.
                callback();
            } else {
                message.expires = new Date(message.expires);
                var m = new Message(message);
                m.save().then(function (message) {
                    callback(message.hashedId);
                }).catch(function (err) {
                    return console.error(err);
                });
            }
        }
    };
}();

exports.Message = Message;
exports.messages = messages;
