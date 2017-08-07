import React from 'react';
import PropTypes from 'prop-types';
import EditableList from './EditableList';
import DateTime from 'react-datetime';
import { messagePropType } from '../types';
import { validIpPattern } from '../actions';

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
                            placeholder="Secure message"
                            required />
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
                                    date => date.isAfter(Date.now())
                                }
                                required />
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
                            onChange={onMaxAccessesChange}
                            required />
                    {   // Use the appropriately noun for the selected value.
                        maxAccesses === '1' ? 'access' : 'accesses'
                    }.
                </label>
                <br />
                <EditableList elements={ipWhitelist}
                        onAdd={onAddIp}
                        onRemove={onRemoveIp}
                        onChange={onEditIp}
                        pattern={validIpPattern} />
            </fieldset>
            <input type="submit"
                    className="form-control"
                    value="submit" />
        </form>
    </div>
);

MessageForm.propTypes = {
    message: messagePropType.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
    onExpiresChange: PropTypes.func.isRequired,
    onMaxAccessesChange: PropTypes.func.isRequired,
    onAddIp: PropTypes.func.isRequired,
    onEditIp: PropTypes.func.isRequired,
    onRemoveIp: PropTypes.func.isRequired
};

export default MessageForm;
