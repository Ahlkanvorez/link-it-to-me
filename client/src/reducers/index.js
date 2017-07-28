import { combineReducers } from 'redux';
import {
    SET_MESSAGE_CONTENT,
    SET_EXPIRATION_DATE,
    SET_MAXIMUM_ACCESSES,
    ADD_WHITELISTED_IP,
    EDIT_WHITELISTED_IP,
    REMOVE_WHITELISTED_IP,
    ADD_MESSAGE,
    SET_USERNAME
} from '../actions';

function username (state = 'Anonymous', action) {
    return action.type === SET_USERNAME ? action.username : state;
}

function messages (state = [], action) {
    return action.type === ADD_MESSAGE ? [ ...state, action.message ] : state;
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
            return state.ipWhitelist.concat(action.ip);
        case EDIT_WHITELISTED_IP:
            return state.ipWhitelist
                .map(ip => (ip === action.oldIp) ? action.newIp : ip);
        case REMOVE_WHITELISTED_IP:
            return state.ipWhitelist.filter(ip => ip !== action.ip);
        default:
            return state;
    }
};

const messageApp = combineReducers({
    username,
    messages,
    message: combineReducers({
        content,
        expires,
        maxAccesses,
        ipWhitelist
    })
});

export default messageApp;
