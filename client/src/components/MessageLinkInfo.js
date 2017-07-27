import React from 'react';

const MessageLinkInfo = ({ id, messageContent }) => (
    <div>
        { id ? (
            <div style={{ display: 'table', margin: '0 auto', paddingTop: '30px' }}>
                <p>
                    <a href={`/view/${id}`}>This link</a> will take you to your secret message, but
                    be careful! If you cause it to self-destruct before your intended recipient can see it,
                    you'll have to make another!
                </p>
                <blockquote>
                    {messageContent}
                </blockquote>
            </div>
        ) : null}
    </div>
);

export default MessageLinkInfo;