import React from 'react';
import { connect } from 'react-redux';
import './react-datetime.css';

import MessageList from './components/MessageList';
import Navbar from './components/Navbar';
import MessageLinkInfo from './components/MessageLinkInfo';
import LoginStatusWarning from './components/LoginStatusWarning';
import NewMessageForm from './containers/NewMessageForm';
import { appPropType } from './types';

// TODO: Complete prop validation.
const App = ({
    username,
    messages: {
        items
    },
    message: {
        content,
        status: { id }
    }
}) => (
    <div className="container">
        <div className="row"
                style={{ display: 'table', margin: '0 auto' }}>
            <Navbar username={ username }
                    links={[ { text: 'Logout', url: '/auth/logout' } ]} />
        </div>
        <div className="row" style={{ marginTop: '60px' }}>
            <div className="col-lg-6">
                <NewMessageForm />
                { id && username !== 'Anonymous' && (
                    <MessageLinkInfo id={ id }
                        content={ items[items.length - 1].content } />
                    )
                }
                <LoginStatusWarning username={ username } />
            </div>
            <div className="col-lg-6">
                <MessageList messages={ items } />
            </div>
        </div>
    </div>
);

App.propType = appPropType.isRequired;

const mapStateToProps = ({ username, messages, message } = {
    username: 'Anonymous',
    messages: [],
    message: {
        content: '',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
        maxAccesses: 1,
        ipWhitelist: [],
        status: {
            isPosting: false,
            id: undefined
        }
    }
}) => ({
    username,
    messages,
    message
});

const MessageApp = connect(mapStateToProps)(App);

// Using connect() implements several performance optimizations.
export default MessageApp;
