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
import { getMessages, setExpirationDate } from './actions';

const store = createStore(
    messageApp,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

store.dispatch(setExpirationDate());
store.dispatch(getMessages());

ReactDOM.render(
    <Provider store={store}>
        <MessageApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
