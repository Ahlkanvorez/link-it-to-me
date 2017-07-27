import { combineReducers } from 'redux';
import {
    SET_MESSAGE_CONTENT,
    SET_EXPIRATION_DATE,
    SET_MAXIMUM_ACCESSES,
    ADD_WHITELISTED_IP,
    REMOVE_WHITELISTED_IP,
    SET_USERNAME
} from '../actions/actions';

function user (state, action) {
    switch (action) {
        case SET_USERNAME:
            return Object.assign({}, state, {
                username: action.username
            });
        default:
            return state;
    }
}

function messages (state = [], action) {
    switch (action.type) {
        case SET_MESSAGE_CONTENT:
            return [
                ...state,
                {
                    content: action.content
                }
            ];
        case SET_EXPIRATION_DATE:
            return [
                ...state,
                {
                    expires: action.date
                }
            ];
        case SET_MAXIMUM_ACCESSES:
            return [
                ...state,
                {
                    maxAccesses: action.maxAccesses
                }
            ];
        case ADD_WHITELISTED_IP:
            return [
                ...state,
                {
                    ipWhitelist: state.ipWhitelist.concat(action.ip)
                }
            ];
        case REMOVE_WHITELISTED_IP:
            return [
                ...state,
                {
                    ipWhitelist:
                        state.ipWhitelist.filter(ip => ip !== action.ip)
                }
            ];
        default:
            return state;
    }
};

const messageApp = combineReducers({
    user,
    messages
});

export default messageApp;
