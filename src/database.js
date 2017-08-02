import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const hash = text => {
    let h = crypto.createHash('sha256');
    h.update(String(text));
    return h.digest('hex');
};

const messageSchema = new Schema({
    hashedId: String,
    content: String,
    expires: Date,
    accesses: Number,
    maxAccesses: Number,
    creatorName: String,
    creatorId: Number,
    ipWhitelist: [ String ]
});

messageSchema.pre('save', function (next) {
    // Don't repeat unnecessary computations.
    if (!this.hashedId) {
        this.hashedId = hash(this._id);
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);

const messages = (() => {
    const isExpired = m =>
        (m.expires <= new Date()|| m.accesses >= m.maxAccesses);

    const deleteExpiredMessages = () => {
        Message.find({
            $or: [
                { expires: { $lt: new Date() } },
                {
                    $where: function () {
                        return this.accesses >= this.maxAccesses;
                    }
                }
            ]
        }).then(messages => {
            messages.forEach(m => {
                Message.remove({ _id: m._id })
                    .catch(err => console.error(err))
                    .then(() => console.log(`Deleted expired message: ${m}`));
            });
        }).catch(err => console.error(err));
    };
    // Delete expired messages on startup.
    deleteExpiredMessages();

    // Delete expired messages every day.
    setTimeout(deleteExpiredMessages, 1000 * 60 * 60 * 24);

    const exposeOnlyHashedId = m => {
        m = m.toJSON();
        m.id = m.hashedId;
        m.hashedId = undefined;
        m._id = undefined;
        return m;
    };

    return {
        findByCreatorId: (id, callback) => {
            Message.find({ creatorId: id }).then(messages => {
                messages.map(m => {
                    if (isExpired(m)) {
                        Message.remove({ _id: m._id })
                            .catch(err => console.error(err));
                    }
                });
                callback(messages
                    .filter(m => !isExpired(m))
                    .map(exposeOnlyHashedId));
            }).catch(err => {
                console.error(err);
                callback();
            });
        },
        findById: (hashedId, userIp, callback) => {
            Message.find({ hashedId: hashedId }).then(messages => {
                const message = messages[0];
                if (!message) {
                    callback();
                } else if (isExpired(message)) {
                    Message.remove({ _id: message._id })
                        .catch(err => console.error(err));
                    callback();
                } else {
                    if (message.ipWhitelist && message.ipWhitelist.length > 0
                            && !message.ipWhitelist.find(ip => ip === userIp)) {
                        // If there is a non-empty whitelist, and the user
                        // requesting to view the message is not on it, indicate
                        // they are forbidden from viewing it.
                        callback('forbidden');
                    } else {
                        message.accesses += 1;
                        message.save()
                            .then(() => callback(exposeOnlyHashedId(message)))
                            .catch(err => console.error(err));
                    }
                }
            }).catch(err => {
                console.error(err);
                callback();
            });
        },
        insert: (message, callback) => {
            if (!message) {
                callback();
            } else if (message.content.length > 3000) {
                // If the message is over 3000 characters in length, don't put
                // it in the database.
                callback();
            } else {
                message.expires = new Date(message.expires);
                const m = new Message(message);
                m.save()
                    .then(message => {
                        callback(message.hashedId);
                    })
                    .catch(err => console.error(err));
            }
        }
    };
})();

export { Message, messages };
