import * as actions from '../src/actions';

describe('actions', () => {
    it('Should create an action to set the message content', () => {
        const content = 'This is some message content';
        const expectedAction = {
            type: actions.SET_MESSAGE_CONTENT,
            content
        };
        expect(actions.setMessageContent(content))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the message content to \'\' when not' +
    ' given a content string.', () => {
        const expectedAction = {
            type: actions.SET_MESSAGE_CONTENT,
            content: ''
        };
        expect(actions.setMessageContent())
            .toEqual(expectedAction);
    });

    it('Should create an action to set the expiration date', () => {
        const expirationDate = new Date();
        const expectedAction = {
            type: actions.SET_EXPIRATION_DATE,
            expirationDate
        };
        expect(actions.setExpirationDate(expirationDate))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the expiration date to a date one day '
    + 'ahead of the current date, if not given an expiration date.', () => {
        const result = actions.setExpirationDate();
        expect(result.type)
            .toEqual(actions.SET_EXPIRATION_DATE);

        // Ensure that the resulting date is between 23 and 25 hours in the
        // future, i.e. roughly tomorrow.
        const post23Hours = new Date(Date.now() + 1000 * 60 * 60 * 23);
        const post25Hours = new Date(Date.now() + 1000 * 60 * 60 * 25);
        expect(post23Hours < result.expirationDate)
            .toBeTruthy();
        expect(result.expirationDate < post25Hours)
            .toBeTruthy();
    });

    it('Should create an action to set the expiratio ndate to a date one day '
    + 'ahead of the current date, if given a past date.', () => {
        const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
        const result = actions.setExpirationDate(yesterday);

        expect(result.type)
            .toEqual(actions.SET_EXPIRATION_DATE);
        expect(result.expirationDate > yesterday)
            .toBeTruthy();

        // Ensure that the resulting date is between 23 and 25 hours in the
        // future, i.e. roughly tomorrow.
        const post23Hours = new Date(Date.now() + 1000 * 60 * 60 * 23);
        const post25Hours = new Date(Date.now() + 1000 * 60 * 60 * 25);
        expect(post23Hours < result.expirationDate)
            .toBeTruthy();
        expect(result.expirationDate < post25Hours)
            .toBeTruthy();
    });

    it('Should create an action to set the maximum accesses.', () => {
        const maxAccesses = 3;
        const expectedAction = {
            type: actions.SET_MAXIMUM_ACCESSES,
            maxAccesses
        };
        expect(actions.setMaximumAccesses(maxAccesses))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the maximum accesses to 1 when not '
    + 'given a number for maximum accesses.', () => {
        const expectedAction = {
            type: actions.SET_MAXIMUM_ACCESSES,
            maxAccesses: 1
        };
        expect(actions.setMaximumAccesses())
            .toEqual(expectedAction);
    });

    it('Should create an action to set the maximum accesses to 1 when given '
    + 'a number for maximum accesses less than 1.', () => {
        const maxAccesses = 0;
        const expectedAction = {
            type: actions.SET_MAXIMUM_ACCESSES,
            maxAccesses: 1
        };
        expect(actions.setMaximumAccesses(maxAccesses))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the maximum accesses to the floor of '
    + 'the provided value when it is a floating point number.', () => {
        const maxAccesses = 2.8;
        const expectedAction = {
            type: actions.SET_MAXIMUM_ACCESSES,
            maxAccesses: 2
        };
        expect(actions.setMaximumAccesses(maxAccesses))
            .toEqual(expectedAction);
    });

    it('Should create an action to add an ip to the whitelist.', () => {
        const ip = '10.0.0.1';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add an empty string to the whitelist if '
    + 'given an invalid IP.', () => {
        const ip = 'Hello, world!';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip: ''
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add a properly formed IPv6 address to the '
    + 'whitelist.', () => {
        const ip = '2001:0db8:0000:0000:0000:ff00:0042:8329';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add an IPv6 address abbreviated by '
    + 'removing leading zeros to the whitelist.', () => {
        const ip = '2001:db8:0:0:0:ff00:42:8329';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add an IPv6 address abbreviated by '
    + 'omitting segments that are all 0 to the whitelist.', () => {
        const ip = '2001:db8::ff00:42:8329';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add an IPv6 address abbreviated maximally '
    + 'to ::1 to the whitelist.', () => {
        const ip = '::1';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to add \'\' to the whitelist when given an '
    + 'IPv6 address overly abbreviated to have :::.', () => {
        const ip = '2001:db8:::ff00:42:8329';
        const expectedAction = {
            type: actions.ADD_WHITELISTED_IP,
            ip: ''
        };
        expect(actions.addWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to replace one IP with another.', () => {
        const oldIp = '10.0.0.1';
        const newIp = '10.0.0.8';
        const expectedAction = {
            type: actions.EDIT_WHITELISTED_IP,
            oldIp,
            newIp
        };
        expect(actions.editWhitelistedIp(oldIp, newIp))
            .toEqual(expectedAction);
    });

    it('Should create an action to replace an old IP with the empty string if '
    + 'not provided a new IP.', () => {
        const oldIp = '10.0.0.1';
        const expectedAction = {
            type: actions.EDIT_WHITELISTED_IP,
            oldIp,
            newIp: ''
        };
        expect(actions.editWhitelistedIp(oldIp))
            .toEqual(expectedAction);
    });

    it('Should create an action to replace an old IP with the new IP even if '
    + 'not provided a valid new IP.', () => {
        const oldIp = '10.0.0.1';
        const newIp = 'Hello, World!';
        const expectedAction = {
            type: actions.EDIT_WHITELISTED_IP,
            oldIp,
            newIp
        };
        expect(actions.editWhitelistedIp(oldIp, newIp))
            .toEqual(expectedAction);
    });

    it('Should create an action to remove a whiltelisted IP.', () => {
        const ip = '10.0.0.1';
        const expectedAction = {
            type: actions.REMOVE_WHITELISTED_IP,
            ip
        };
        expect(actions.removeWhitelistedIp(ip))
            .toEqual(expectedAction);
    });

    it('Should create an action to remove the empty string from the '
    + 'whitelist if not given an IP.', () => {
        const expectedAction = {
            type: actions.REMOVE_WHITELISTED_IP,
            ip: ''
        };
        expect(actions.removeWhitelistedIp())
            .toEqual(expectedAction);
    });

    it('Should create an action to set the username.', () => {
        const username = 'User';
        const expectedAction = {
            type: actions.SET_USERNAME,
            username
        };
        expect(actions.setUsername(username))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the username to \'Anonymous\' '
    + 'if not provided a username.', () => {
        const expectedAction = {
            type: actions.SET_USERNAME,
            username: 'Anonymous'
        };
        expect(actions.setUsername())
            .toEqual(expectedAction);
    });

    it('Should create an action to request messages.', () => {
        const expectedAction = {
            type: actions.REQUEST_MESSAGES
        };
        expect(actions.requestMessages())
            .toEqual(expectedAction);
    });

    it('Should create an action to receive messages.', () => {
        const messages = [ 'a', 'b', 'c' ];
        const expectedAction = {
            type: actions.RECEIVE_MESSAGES,
            messages
        };
        expect(actions.receiveMessages(messages))
            .toEqual(expectedAction);
    });

    it('Should create an action to receive messages, with the value of '
    + 'the empty list if not provided an argument.', () => {
        const expectedAction = {
            type: actions.RECEIVE_MESSAGES,
            messages: []
        };
        expect(actions.receiveMessages())
            .toEqual(expectedAction);
    });

    it('Should create an action indicating a state "posting a message"', () => {
        const expectedAction = {
            type: actions.POSTING_MESSAGE
        };
        expect(actions.postingMessage())
            .toEqual(expectedAction);
    });

    it('Should create an action to indicate a state of having posted '
    + 'a message with a provided ID.', () => {
        const id = '123abc';
        const expectedAction = {
            type: actions.POSTED_MESSAGE,
            id
        };
        expect(actions.postedMessage(id))
            .toEqual(expectedAction);
    });

    it('Should create an action to set a message as posted anonymously', () => {
        const message = { hello: 'world' };
        const expectedAction = {
            type: actions.SET_ANONYMOUS_POSTED_MESSAGE,
            message
        };
        expect(actions.setAnonymousPostedMessage(message))
            .toEqual(expectedAction);
    });

    // TODO: Test the thunk action creators.
});
