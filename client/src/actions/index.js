// Action types
export const SET_MESSAGE_CONTENT = 'SET_MESSAGE_CONTENT';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';
export const SET_MAXIMUM_ACCESSES = 'SET_MAXIMUM_ACCESSES';

export const ADD_WHITELISTED_IP = 'ADD_WHITELISTED_IP';
export const EDIT_WHITELISTED_IP = 'EDIT_WHITELISTED_IP';
export const REMOVE_WHITELISTED_IP = 'REMOVE_WHITELISTED_IP';

export const ADD_MESSAGE = 'ADD_MESSGE';
export const SET_USERNAME = 'GET_USERNAME';

export const GET_MESSAGES = 'GET_MESSAGES';
export const POST_MESSAGE = 'POST_MESSAGE';

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

export function addMessage (message) {
    return { type: ADD_MESSAGE, message };
}

export function setUsername (username = '') {
    return { type: SET_USERNAME, username };
}

export function getMessages () {
    return { type: GET_MESSAGES };
}

export function postMessage (message) {
    return { type: POST_MESSAGE, message };
}
