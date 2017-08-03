import React from 'react';
import Message from './Message';
import { messagesPropType } from '../types';

const MessageList = ({ messages }) => (
    (messages && messages.length > 0) && (
        <div style={{ display: 'table', margin: '0 auto' }}>
            <h3>Your Messages</h3>
            <ul style={{ listStyleType: 'none' }}>
                {
                    messages.map(m => (
                        <li key={ m.id }>
                            <Message value={m} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
);

MessageList.propTypes = {
    messages: messagesPropType.isRequired
};

export default MessageList;
