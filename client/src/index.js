import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import MessageApp from './app';
import registerServiceWorker from './registerServiceWorker';
import messageApp from './reducers';
import {
    getMessages,
    setExpirationDate,
    getMessagesIfNeeded
} from './actions';

const store = createStore(
    messageApp,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

store.dispatch(setExpirationDate());

// Only check for messages for non-anonymous users.
if (window.location.pathname !== '/guest') {
    store.dispatch(getMessages());

    // Refresh every 5 minutes.
    const { dispatch, getState } = store;
    setTimeout(getMessagesIfNeeded(dispatch, getState), 1000 * 60 * 1);
}

ReactDOM.render(
    <Provider store={store}>
        <MessageApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
