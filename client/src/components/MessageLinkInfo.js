import React from 'react';
import PropTypes from 'prop-types';

const MessageLinkInfo = ({ id, content }) => (
    <div style={{
            display: 'table',
            margin: '0 auto',
            paddingTop: '30px'
        }}>
        <p>
            <a href={`/view/${id}`}>This link</a> will take you to your
            secret message, but be careful! If you cause it to self-destruct
            before your intended recipient can see it, {`you'll`} have to
            make another!
        </p>
        <blockquote>
            { content }
        </blockquote>
    </div>
);

MessageLinkInfo.propTypes = {
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired
};

export default MessageLinkInfo;
