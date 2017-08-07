import React from 'react';
import PropTypes from 'prop-types';

const RemovableListInput = ({ value, onChange, onDelete, pattern }) => (
    <tr>
        <td>
            <input value={value}
                className="form-control"
                type="text"
                data-tip="Enter a Valid IP Address"
                title="A valid IP Address"
                pattern={pattern}
                onChange={e => {
                    e.preventDefault();
                    onChange(value, e.target.value);
                }}
                required />
        </td>
        <td>
            <button className="btn btn-default"
                    style={{ width: '100%' }}
                    type="button"
                    onClick={() => onDelete(value)}>
                Delete
            </button>
        </td>
    </tr>
);

RemovableListInput.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    pattern: PropTypes.string.isRequired
};

export default RemovableListInput;
