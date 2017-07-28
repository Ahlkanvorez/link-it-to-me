import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import messageApp from './reducers';

const store = createStore(messageApp);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

registerServiceWorker();
