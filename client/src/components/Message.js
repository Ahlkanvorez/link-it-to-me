import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Message = ({
    value: {
        content, id, expires, maxAccesses, accesses, ipWhitelist
    }
}) => (
    <table className="table">
        <tbody>
        <tr>
            <td className="text-right">Content: </td>
            <td>{ content }</td>
        </tr>
        <tr>
            <td className="text-right">Link: </td>
            <td><a href={`/view/${id}`}>Secure link</a></td>
        </tr>
        <tr>
            <td className="text-right">Self-destructs on: </td>
            <td>{ moment(expires).format('dddd, MMMM Do YYYY, h:mm:ss a') }</td>
        </tr>
        <tr>
            <td className="text-right">Views remaining: </td>
            <td>{ Math.max(0, maxAccesses - accesses) }</td>
        </tr>
        { ipWhitelist && ipWhitelist.length > 0 && (
            <tr>
                <td className="text-right">IP Whitelist: </td>
                <td>
                    <ul>
                        { ipWhitelist.map(ip => (<li key={ip}>{ip}</li>)) }
                    </ul>
                </td>
            </tr>)
        }
        </tbody>
    </table>
);

Message.propTypes = {
    value: PropTypes.objectOf(
        PropTypes.shape({
            content: PropTypes.string.isRequired,
            expires: PropTypes.instanceOf(Date).isRequired,
            maxAccesses: PropTypes.number.isRequired,
            ipWhitelist: PropTypes.arrayOf(
                PropTypes.shape({
                    ip: PropTypes.string.isRequired
                })
            ).isRequired
        }).isRequired
    ).isRequired
};

export default Message;
