import { combineReducers } from 'redux';
import {
    SET_MESSAGE_CONTENT,
    SET_EXPIRATION_DATE,
    SET_MAXIMUM_ACCESSES,
    ADD_WHITELISTED_IP,
    REMOVE_WHITELISTED_IP,
    ADD_MESSAGE,
    SET_USERNAME
} from '../actions/actions';

function username (state = {}, action) {
    switch (action) {
        case SET_USERNAME:
            return action.username;
        default:
            return state;
    }
}

function message (state = {}, action) {
    switch (action.type) {
        case SET_MESSAGE_CONTENT:
            return Object.assign({}, state, {
                content: action.content
            });
        case SET_EXPIRATION_DATE:
            return Object.assign({}, state, {
                expirationDate: action.expirationDate
            });
        case SET_MAXIMUM_ACCESSES:
            return Object.assign({}, state, {
                maxAccesses: action.maxAccesses
            });
        case ADD_WHITELISTED_IP:
            return Object.assign({}, state, {
                ipWhitelist: state.ipWhitelist.concat(action.ip)
            });
        case REMOVE_WHITELISTED_IP:
            return Object.assign({}, state, {
                ipWhitelist: state.ipWhitelist.filter(ip => ip !== action.ip)
            });
        default:
            return state;
    }
};

function messages (state = [], action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return [
                ...state,
                action.message
            ];
        default:
            return state;
    }
}

const messageApp = combineReducers({
    username,
    message,
    messages
});

export default messageApp;
