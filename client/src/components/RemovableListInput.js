import React from 'react';

const RemovableListInput = ({ value, onChange, onDelete }) => (
    <tr>
        <td>
            <input type="text"
                    className="form-control"
                    value={value}
                    onChange={e => {
                        e.preventDefault();
                        onChange(value, e.target.value);
                    }} />
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

export default RemovableListInput;