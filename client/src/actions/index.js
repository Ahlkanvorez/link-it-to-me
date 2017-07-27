// Action types
export const SET_MESSAGE_TEXT = 'SET_MESSAGE_TEXT';
export const SET_EXPIRATION_DATE = 'SET_EXPIRATION_DATE';
export const SET_MAXIMUM_ACCESSES = 'SET_MAXIMUM_ACCESSES';
export const ADD_WHITELISTED_IP = 'ADD_WHITELISTED_IP';
export const REMOVE_WHITELISTED_IP = 'REMOVE_WHITELISTED_IP';

// Action creators
export function setMessageText (text) {
    return { type: SET_MESSAGE_TEXT, text };
};

export function setExpirationDate (date) {
    return { type: SET_EXPIRATION_DATE, date };
};

export function setMaximumAccesses (maxAccesses) {
    return { type: SET_MAXIMUM_ACCESSES, maxAccesses };
};

export function addWhitelistedIp (ip) {
    return { type: ADD_WHITELISTED_IP, ip };
};

export function removeWhitelistedIp (ip) {
    return { type: REMOVE_WHITELISTED_IP, ip };
};
