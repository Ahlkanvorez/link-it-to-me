import React from 'react';
import PropTypes from 'prop-types';

const RemovableListInput = ({ value, onChange, onDelete }) => (
    <tr>
        <td>
            <input type="text"
                    className="form-control"
                    value={value}
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
    onDelete: PropTypes.func.isRequired
};

export default RemovableListInput;
