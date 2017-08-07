import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-icons-kit';
import { ic_info_outline } from 'react-icons-kit/md/ic_info_outline';
import { ipWhitelistPropType } from '../types';
import RemovableListInput from './RemovableListInput';

const IpInfoTooltip = props => (
    <div { ...props }>
        <p>
            You must enter a valid IP address, such as
            the following:
        </p>
        <ul>
            <li>IPv4: 10.0.0.1</li>
            <li>
                IPv6: one of the following formats:
                <ul>
                    <li>2001:0db8:0000:0000:0000:ff00:0042:8329</li>
                    <li>2001:db8:0:0:0:ff00:42:8329</li>
                    <li>2001:db8::ff00:42:8329</li>
                </ul>
            </li>
        </ul>
        <p>
            If you enter an IPv4 address, it will be
            converted to an IPv6 address by prefixing
            the address with <code>::ffff:</code>
        </p>
    </div>
);

const EditableList = ({ elements, onAdd, onRemove, onChange, pattern }) => (
    <table className="table">
        <thead>
        <tr>
            <th>
                {
                    (elements.length === 0)
                    ? 'Publicly Viewable'
                    : (
                        <div>
                            <span>Whitelisted IP Addresses</span>
                            <span onClick={ () => alert(
`You must enter a valid IP address, such as the following:
    IPv4: 10.0.0.1
    IPv6: one of the following formats:
     - 2001:0db8:0000:0000:0000:ff00:0042:8329
     - 2001:db8:0:0:0:ff00:42:8329
     - 2001:db8::ff00:42:8329

If you enter an IPv4 address, it will be converted to an IPv6 address by \
prefixing the address with ::ffff:
`)
                            } style={ { cursor: 'pointer' } } >
                                <Icon icon={ic_info_outline} />
                            </span>
                        </div>
                    )
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
                    onChange={onChange}
                    pattern={pattern} />
            ))
        }
        </tbody>
    </table>
);

EditableList.propTypes = {
    elements: ipWhitelistPropType.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    pattern: PropTypes.string.isRequired
};

export default EditableList;
