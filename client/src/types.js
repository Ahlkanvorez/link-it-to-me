import PropTypes from 'prop-types';

export const statusPropType = PropTypes.objectOf({
    isPosting: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired
});

export const ipWhitelistPropType = PropTypes.arrayOf(
    PropTypes.shape([
        PropTypes.string
    ]).isRequired
);

export const messagePropType = PropTypes.objectOf(
    PropTypes.shape({
        content: PropTypes.string,
        expires: PropTypes.instanceOf(Date).isRequired,
        maxAccesses: PropTypes.number.isRequired,
        ipWhitelist: ipWhitelistPropType.isRequired,
        status: statusPropType.isRequired
    }).isRequired
);

export const messagesPropType = PropTypes.arrayOf(
    PropTypes.objectOf({
        message: messagePropType.isRequired,
        isFetching: PropTypes.bool.isRequired,
        didInvalidate: PropTypes.bool.isRequired
    })
);

export const appPropType = PropTypes.objectOf({
    username: PropTypes.string.isRequired,
    messages: messagesPropType.isRequired,
    message: messagePropType.isRequired
});
