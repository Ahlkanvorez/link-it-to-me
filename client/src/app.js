import React from 'react';
import axios from 'axios';
import DateTime from 'react-datetime';
import moment from 'moment';
import './react-datetime.css'

const baseUrl = 'http://localhost:3001';
const http = axios.create({ baseURL: baseUrl });

const Message = props => (
    <table className="table">
        <tbody>
        <tr>
            <td className="text-right">Content: </td>
            <td>{ props.value.content }</td>
        </tr>
        <tr>
            <td className="text-right">Link: </td>
            <td><a href={`/view/${props.value._id}`}>Secure link</a></td>
        </tr>
        <tr>
            <td className="text-right">Self-destructs on: </td>
            <td>{ moment(props.value.expires).format("dddd, MMMM Do YYYY, h:mm:ss a") }</td>
        </tr>
        <tr>
            <td className="text-right">Views remaining: </td>
            <td>{ props.value.maxAccesses - props.value.accesses }</td>
        </tr>
        <tr>
            <td className="text-right">IP Whitelist: </td>
            <td>
                <ul>
                {
                    props.value.ipWhitelist
                        ? props.value.ipWhitelist.map(ip => (
                            <li key={ip}>{ip}</li>
                        )) : null

                }
                </ul>
            </td>
        </tr>
        </tbody>
    </table>
);

const MessageList = props => (
    <div className={props.className} style={{ display: 'table', margin: '0 auto' }}>
        {
            (props.messages && props.messages.length > 0)
                ? (
                    <div>
                        <h3>Your Messages</h3>
                        <ul style={{ listStyleType: 'none' }}>
                            {
                                props.messages.map(m => (
                                    <li key={ m._id }>
                                        <Message value={m} />
                                    </li>
                                ))
                            }
                        </ul>
                    </div>)
                : null
        }
    </div>
);

class RemovableListInput extends React.Component {
    constructor (props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange (event) {
        this.props.onChange(this.props.value, event.target.value);
    }

    render () {
        return (
            <tr>
                <td>
                    <input type="text" className="form-control" value={this.props.value} onChange={this.onInputChange} />
                </td>
                <td>
                    <button className="btn btn-default" style={{ width: '100%' }} type="button" onClick={() => this.props.onDelete(this.props.value)}>Delete</button>
                </td>
            </tr>
        );
    }
}

class EditableList extends React.Component {
    constructor (props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    onDelete  (e) {
        this.props.onChange(this.props.elements.filter(x => x !== e));
    }

    onChange (oldElement, newElement) {
        this.props.onChange(this.props.elements.map(x => x === oldElement ? newElement : x));
    }

    addItem () {
        this.props.onChange(this.props.elements.concat(''));
    }

    render () {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>{this.props.elements.length === 0 ? 'Publicly Viewable' : 'Whitelisted IP Addresses'}</th>
                        <th>
                            <button className="btn btn-default" style={{ width: '100%' }} type="button" onClick={this.addItem}>Whitelist an IP</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {   // Display each of the messages
                    this.props.elements.map((e, index) => (
                        <RemovableListInput key={index} value={e} onDelete={this.onDelete} onChange={this.onChange} />
                    ))
                }
                </tbody>
            </table>
        );
    }
}

class MessageForm extends React.Component {
    constructor (props) {
        super(props);

        let date = new Date();
        date.setDate(date.getDate() + 1);
        this.state = {
            content: '',
            expires: date,
            maxAccesses: '1', // NOTE: The value of an <input type="number" /> is a string!
            ipWhitelist: []
        };

        this.handleMaxAccessesChange = this.handleMaxAccessesChange.bind(this);
        this.handleExpiresChange = this.handleExpiresChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleIpWhitelistChange = this.handleIpWhitelistChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleIpWhitelistChange (ips) {
        this.setState({ ipWhitelist: ips });
    }

    handleContentChange (event) {
        this.setState({ content: event.target.value, id: undefined });
    }

    handleExpiresChange (moment) {
        this.setState({ expires: moment._d, id: undefined });
    }

    handleMaxAccessesChange (event) {
        this.setState({ maxAccesses: event.target.value, id: undefined });
    }

    handleSubmit (event) {
        http.post('/', {
            content: this.state.content,
            expires: this.state.expires,
            maxAccesses: this.state.maxAccesses,
            ipWhitelist: this.state.ipWhitelist
        }).then(res => {
            console.log(res);
            this.setState({
                id: res.data.id,
                messageContent: res.data.content
            });
        }).catch(err => {
            console.log(err);
        });

        this.props.onSubmit();
        event.preventDefault();
    }

    render () {
        return (
            <div className={this.props.className}>
                <form onSubmit={this.handleSubmit} style={{ display: 'table', margin: '0 auto' }}>
                    <fieldset>
                        <legend>Make a link</legend>
                        <textarea value={this.state.content}
                                  className="form-control"
                                  style={{ width: '100%' }}
                                  onChange={this.handleContentChange}
                                  placeholder="Secure message" />
                        <br />
                        <label>
                            Self-destruct on
                        </label>
                        <span style={{ display: 'inline-block', marginLeft: '0.5em', marginRight: '0.5em' }}>
                            <DateTime value={this.state.expires}
                                      onChange={this.handleExpiresChange}
                                      isValidDate={date => date.isAfter(new Date())} />
                        </span>
                        <br />
                        <label>
                            or after
                            <input type="number"
                                   className="form-control"
                                   min="1"
                                   style={{ display: 'inline-block', width: '4em', marginLeft: '0.5em', marginRight: '0.5em' }}
                                   value={this.state.maxAccesses}
                                   onChange={this.handleMaxAccessesChange} />
                            {   // Use the appropriately numbered noun for the selected value.
                                this.state.maxAccesses === '1'
                                    ? 'access'
                                    : 'accesses'
                            }.
                        </label>
                        <br />
                        <EditableList elements={this.state.ipWhitelist} onChange={this.handleIpWhitelistChange} />
                    </fieldset>
                    <input type="submit" className="form-control" value="submit" />
                </form>
                { this.state.id ? (
                    <div style={{ display: 'table', margin: '0 auto', paddingTop: '30px' }}>
                        <p>
                            <a href={`/view/${this.state.id}`}>This link</a> will take you to your secret message, but
                            be careful! If you cause it to self-destruct before your intended recipient can see it,
                            you'll have to make another!
                        </p>
                        <blockquote>
                            {this.state.messageContent}
                        </blockquote>
                    </div>
                ) : null}
            </div>
        );
    }
}

const Navbar = props => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <a className="navbar-brand">
                    {props.username}
                </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <li>
                        <a href={`${baseUrl}/auth/logout`}>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: 'Anonymous',
            messages: []
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.updateMessages();
    }

    updateMessages () {
        http.get('/messages').then(res => {
            if (res) {
                this.setState({
                    username: res.data.username || 'Anonymous',
                    messages: res.data.messages || []
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render () {
        return (
            <div className="container">
                <div className="row"
                     style={{ display: 'table', margin: '0 auto' }}>
                    <Navbar username={this.state.username} />
                </div>
                <div className="row" style={{ marginTop: '60px' }}>
                    <MessageForm className="col-lg-6" onSubmit={this.updateMessages} />
                    <MessageList className="col-lg-6" messages={this.state.messages} />
                </div>
            </div>
        );
    }
}

export default App;
