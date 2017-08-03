import axios from 'axios';

// TODO: Setup proper toggling of dev/production urls.
const serverURL = 'http://localhost:3001';

// Action types
export const SET_MESSAGE_CONTENT = 'SET_MESSAGE_CONTENT';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';
export const SET_MAXIMUM_ACCESSES = 'SET_MAXIMUM_ACCESSES';

export const ADD_WHITELISTED_IP = 'ADD_WHITELISTED_IP';
export const EDIT_WHITELISTED_IP = 'EDIT_WHITELISTED_IP';
export const REMOVE_WHITELISTED_IP = 'REMOVE_WHITELISTED_IP';

export const SET_USERNAME = 'GET_USERNAME';

export const REQUEST_MESSAGES = 'REQUEST_MESSAGES';
export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';
export const POSTING_MESSAGE = 'POSTING_MESSAGE';
export const POSTED_MESSAGE = 'POSTED_MESSAGE';

export const SET_ANONYMOUS_POSTED_MESSAGE = 'SET_ANONYMOUS_POSTED_MESSAGE';

// Action creators
export function setMessageContent (content = '') {
    return { type: SET_MESSAGE_CONTENT, content };
};

const tomorrow = () => new Date(Date.now() + 1000 * 60 * 60 * 24);
export function setExpirationDate (expirationDate = tomorrow()) {
    return { type: SET_EXPIRATION_DATE, expirationDate };
};

export function setMaximumAccesses (maxAccesses = 1) {
    return { type: SET_MAXIMUM_ACCESSES, maxAccesses };
};

export function addWhitelistedIp (ip) {
    return { type: ADD_WHITELISTED_IP, ip };
};

export function editWhitelistedIp (oldIp, newIp) {
    return { type: EDIT_WHITELISTED_IP, oldIp, newIp };
};

export function removeWhitelistedIp (ip) {
    return { type: REMOVE_WHITELISTED_IP, ip };
};

export function setUsername (username = '') {
    return { type: SET_USERNAME, username };
}

export function requestMessages () {
    return { type: REQUEST_MESSAGES };
}

export function receiveMessages (messages) {
    return { type: RECEIVE_MESSAGES, messages };
}

export function postingMessage () {
    return { type: POSTING_MESSAGE };
}

export function postedMessage (id) {
    return { type: POSTED_MESSAGE, id };
}

export function setAnonymousPostedMessage (message) {
    return { type: SET_ANONYMOUS_POSTED_MESSAGE, message };
}

// Thunk action creators
export function postMessage (message) {
    return function (dispatch) {
        // Enter an app state of posting a message.
        dispatch(postingMessage());

        return axios.post(`${serverURL}/`, message)
            .then(response => response.data,
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing an loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occured.', error)
            // Enter an app state of having posted a message.
            ).then(data => {
                // TODO: Find a better way to do this easily.
                if (window.location.pathname === '/guest') {
                    dispatch(setAnonymousPostedMessage(Object.assign({},
                        message,
                        { id: data.id }
                    )));
                } else {
                    dispatch(getMessages());
                }
                dispatch(postedMessage(data.id));
            }
        );
    };
}

export function getMessages () {
    return function (dispatch) {
        // Enter an app state of requesting messages.
        dispatch(requestMessages());

        return axios.get(`${serverURL}/messages`)
            .then(response => response.data,
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing an loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => console.log('An error occured.', error)
            // Enter an app state of receiving messages.
            ).then(data => {
                // Messages come from the server [ oldest, ..., newest ].
                // Reversing the messages makes them display more intuitively
                //  [ newest, ..., oldest ].
                dispatch(receiveMessages(data.messages.reverse(), Date.now()));

                dispatch(setUsername(data.username));
            }
        );
    };
}

const shouldGetMessages = ({
    username,
    messages: { items, didInvalidate, isFetching }
}) => username && username !== 'Anonymous' && !isFetching
        && (!items || didInvalidate);

export function getMessagesIfNeeded (dispatch, getState) {
    return () => {
        return shouldGetMessages(getState())
            ? dispatch(getMessages())
            : Promise.resolve();
    };
}
