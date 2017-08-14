import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import MessageApp from './App';
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
    setTimeout(getMessagesIfNeeded(dispatch, getState), 1000 * 60 * 5);
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <MessageApp />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

registerServiceWorker();
