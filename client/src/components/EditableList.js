import React from 'react';
import RemovableListInput from './RemovableListInput';

const EditableList = ({ elements, onChange }) => (
    <table className="table">
        <thead>
        <tr>
            <th>
                {
                    (elements.length === 0)
                    ? 'Publicly Viewable'
                    : 'Whitelisted IP Addresses'
                }
            </th>
            <th>
                <button className="btn btn-default"
                        style={{ width: '100%' }}
                        type="button"
                        onClick={() => onChange(elements.concat('')) }>
                    Whitelist an IP
                </button>
            </th>
        </tr>
        </thead>
        <tbody>
        {   // Display each of the messages
            elements.map((e, index) => (
                <RemovableListInput key={index}
                    value={e}
                    onDelete={e => onChange(elements.filter(x => x !== e)) }
                    onChange={(old, changed) => 
                        onChange(elements.map(x => (x === old) ? changed : x))
                    } />
            ))
        }
        </tbody>
    </table>
);

export default EditableList;