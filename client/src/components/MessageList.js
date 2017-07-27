import React from 'react';
import Message from './Message';

const MessageList = ({ className, messages }) => (
    (messages && messages.length > 0) ? (
        <div className={ className }
                style={{
                    display: 'table',
                    margin: '0 auto'
                }}>
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
    ) : null
);

export default MessageList;