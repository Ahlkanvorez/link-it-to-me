import { combineReducers } from 'redux';
import {
    SET_MESSAGE_CONTENT,
    SET_EXPIRATION_DATE,
    SET_MAXIMUM_ACCESSES,
    ADD_WHITELISTED_IP,
    EDIT_WHITELISTED_IP,
    REMOVE_WHITELISTED_IP,
    SET_USERNAME,
    REQUEST_MESSAGES,
    RECEIVE_MESSAGES,
    POSTING_MESSAGE,
    POSTED_MESSAGE,
    SET_ANONYMOUS_POSTED_MESSAGE
} from '../actions';

function username (state = 'Anonymous', action) {
    return action.type === SET_USERNAME ? action.username : state;
}

function messages (state = {
        isFetching: false,
        items: []
    }, action) {
    switch (action.type) {
        case REQUEST_MESSAGES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MESSAGES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.messages
            });
        case POSTING_MESSAGE:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true
            });
        case SET_ANONYMOUS_POSTED_MESSAGE:
            return Object.assign({}, state, {
                didInvalidate: false,
                isFetching: false,
                items: [ action.message ]
            });
        default:
            return state;
    }
}

function content (state = '', action) {
    return action.type === SET_MESSAGE_CONTENT ? action.content : state;
}

function expires (state = null, action) {
    return action.type === SET_EXPIRATION_DATE ? action.expirationDate : state;
}

function maxAccesses (state = 1, action) {
    return action.type === SET_MAXIMUM_ACCESSES ? action.maxAccesses : state;
}

function ipWhitelist (state = [], action) {
    switch (action.type) {
        case ADD_WHITELISTED_IP:
            return state.concat(action.ip);
        case EDIT_WHITELISTED_IP:
            return state.map(ip => (ip === action.oldIp) ? action.newIp : ip);
        case REMOVE_WHITELISTED_IP:
            return state.filter(ip => ip !== action.ip);
        default:
            return state;
    }
};

function status (state = {}, action) {
    switch (action.type) {
        case POSTING_MESSAGE:
            return Object.assign({}, state, {
                isPosting: true
            });
        case POSTED_MESSAGE:
            return Object.assign({}, state, {
                isPosting: false,
                id: action.id
            });
        default:
            return state;
    }
}

const messageApp = combineReducers({
    username,
    messages,
    message: combineReducers({
        content,
        expires,
        maxAccesses,
        ipWhitelist,
        status
    })
});

export default messageApp;
