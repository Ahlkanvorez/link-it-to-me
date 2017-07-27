import React from 'react';
import Message from './Message';

const MessageList = ({ className, messages }) => (
    <div className={className} style={{ display: 'table', margin: '0 auto' }}>
        {
            (messages && messages.length > 0)
                ? (
                <div>
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
                </div>)
                : null
        }
    </div>
);

export default MessageList;