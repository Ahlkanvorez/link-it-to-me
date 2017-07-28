import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

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
    messages: PropTypes.arrayOf(
        PropTypes.objectOf(
            PropTypes.shape({
                content: PropTypes.string.isRequired,
                expires: PropTypes.instanceOf(Date).isRequired,
                maxAccesses: PropTypes.number.isRequired,
                ipWhitelist: PropTypes.arrayOf(
                    PropTypes.shape([
                        PropTypes.string
                    ]).isRequired
                ).isRequired
            }).isRequired
        ).isRequired
    ).isRequired
};

export default MessageList;
