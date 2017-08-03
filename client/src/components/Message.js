import React from 'react';
import moment from 'moment';
import { messagePropType } from '../types';

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
            <td>{ Math.max(0, maxAccesses - (accesses || 0) ) }</td>
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
    value: messagePropType.isRequired
};

export default Message;
