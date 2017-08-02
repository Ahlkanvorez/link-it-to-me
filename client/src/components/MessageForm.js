import React from 'react';
import PropTypes from 'prop-types';
import EditableList from './EditableList';
import DateTime from 'react-datetime';

const MessageForm = ({
    message: {
        content, expires, maxAccesses, ipWhitelist
    },
    onSubmit,
    onContentChange,
    onExpiresChange,
    onMaxAccessesChange,
    onAddIp,
    onEditIp,
    onRemoveIp
}) => (
    <div>
        <form onSubmit={onSubmit}
                style={ {
                    display: 'table',
                    margin: '0 auto'
                } }>
            <fieldset>
                <legend>Make a link</legend>
                <textarea value={content}
                            className="form-control"
                            style={{ width: '100%' }}
                            onChange={onContentChange}
                            placeholder="Secure message" />
                <br />
                <label>
                    Self-destruct on
                </label>
                <span style={ {
                            display: 'inline-block',
                            marginLeft: '0.5em',
                            marginRight: '0.5em'
                        } }>
                    <DateTime value={expires}
                                onChange={onExpiresChange}
                                isValidDate={
                                    date => date.isAfter(new Date())
                                } />
                </span>
                <label>
                    or after
                    { /* NOTE: The value of an <input type="number" />
                        is a string! */ }
                    <input type="number"
                            className="form-control"
                            min="1"
                            style={ {
                                display: 'inline-block',
                                width: '4em',
                                marginLeft: '0.5em',
                                marginRight: '0.5em'
                            } }
                            value={maxAccesses}
                            onChange={onMaxAccessesChange} />
                    {   // Use the appropriately noun for the selected value.
                        maxAccesses === '1' ? 'access' : 'accesses'
                    }.
                </label>
                <br />
                { /* TODO: Make this automatic. */ }
                <p>
                    If you would like to add an IPv4 address to the
                    whitelist, prefix the address with
                    &quot;::ffff:&quot; to convert it to an IPv6
                    address.
                </p>
                <EditableList elements={ipWhitelist}
                        onAdd={onAddIp}
                        onRemove={onRemoveIp}
                        onChange={onEditIp} />
            </fieldset>
            <input type="submit"
                    className="form-control"
                    value="submit" />
        </form>
    </div>
);

MessageForm.propTypes = {
    message: PropTypes.objectOf(
        PropTypes.shape({
            content: PropTypes.string.isRequired,
            expires: PropTypes.instanceOf(Date).isRequired,
            maxAccesses: PropTypes.number.isRequired,
            ipWhitelist: PropTypes.arrayOf(
                PropTypes.shape([
                    PropTypes.string
                ])
            ).isRequired
        }).isRequired
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
    onExpiresChange: PropTypes.func.isRequired,
    onMaxAccessesChange: PropTypes.func.isRequired,
    onAddIp: PropTypes.func.isRequired,
    onEditIp: PropTypes.func.isRequired,
    onRemoveIp: PropTypes.func.isRequired
};

export default MessageForm;
