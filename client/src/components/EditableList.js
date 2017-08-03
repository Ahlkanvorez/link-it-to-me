import React from 'react';
import PropTypes from 'prop-types';
import { ipWhitelistPropType } from '../types';
import RemovableListInput from './RemovableListInput';

const EditableList = ({ elements, onAdd, onRemove, onChange }) => (
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
                        onClick={() => {
                            if (!elements || elements.length === 0
                                    || elements[elements.length - 1] !== '') {
                                onAdd('');
                            }
                         } }>
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
                    onDelete={onRemove}
                    onChange={onChange} />
            ))
        }
        </tbody>
    </table>
);

EditableList.propTypes = {
    elements: ipWhitelistPropType.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default EditableList;
