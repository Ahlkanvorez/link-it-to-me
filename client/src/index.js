import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MessageApp from './app';
import registerServiceWorker from './registerServiceWorker';
import messageApp from './reducers';

const store = createStore(messageApp);

ReactDOM.render(
    <Provider store={store}>
        <MessageApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
