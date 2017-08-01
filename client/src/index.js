import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import MessageApp from './app';
import registerServiceWorker from './registerServiceWorker';
import messageApp from './reducers';

const store = createStore(
    messageApp,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

ReactDOM.render(
    <Provider store={store}>
        <MessageApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
