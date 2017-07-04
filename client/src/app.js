import React from 'react';
import axios from 'axios';
import DateTime from 'react-datetime';
import './react-datetime.css'

const baseUrl = 'http://localhost:3001';
const http = axios.create({ baseURL: baseUrl });

const UserInfo = props => (
    <div style={props.style}>
        <span style={{ marginRight: '4em' }}>{props.username}</span>
        <a href={`${baseUrl}/logout`}>Logout</a>
    </div>
);

const MessageList = props => (
    <div style={props.style}>
        {
            (props.messages && props.messages.length > 0)
                ? (
                    <div>
                        <h3>Your Messages</h3>
                        <ul>
                            {
                                props.messages.map(m => (
                                    <li key={ m._id }>
                                        <a href={`/view/${m._id}`}>{ m.content }</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>)
                : null
        }
    </div>
);

class MessageForm extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            content: '',
            expires: new Date(),
            maxAccesses: '1' // NOTE: The value of an <input type="number" /> is a string!
        };

        this.handleMaxAccessesChange = this.handleMaxAccessesChange.bind(this);
        this.handleExpiresChange = this.handleExpiresChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            maxAccesses: this.state.maxAccesses
        }).then(res => {
            this.setState({ id: res.id });
        }).catch(err => {
            console.log(err);
        });

        this.props.onSubmit();
        event.preventDefault();
    }

    render () {
        return (
            <form onSubmit={this.handleSubmit}  style={this.props.style}>
                <fieldset>
                    <legend>Secure communique</legend>
                    <textarea value={this.state.content}
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
                    <label>
                        or after
                        <input type="number"
                               min="1"
                               style={{ width: '4em', marginLeft: '0.5em', marginRight: '0.5em' }}
                               value={this.state.maxAccesses}
                               onChange={this.handleMaxAccessesChange} />
                        {   // Use the appropriately numbered noun for the selected value.
                            this.state.maxAccesses === '1'
                                ? 'access'
                                : 'accesses'
                        }.
                    </label>
                </fieldset>
                <input type="submit" value="submit" />
                { this.state.id ? (
                    <p style={{ display: 'table', margin: '0 auto' }}>
                        The following link will take you to your secret communique, but be careful! If you cause it to
                        self-destruct before your intended recipient can see it, you'll have to make another!
                        <a href={`/view/${this.state.id}`}>{this.state.id}</a>
                    </p>
                ) : null}
            </form>
        );
    }
}

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
            <div>
                <UserInfo username={this.state.username}
                          style={{ display: 'table', margin: '0 auto' }} />
                <MessageForm style={{ display: 'table', margin: '0 auto' }}
                             onSubmit={this.updateMessages} />
                <MessageList messages={this.state.messages}
                             style={{ display: 'table', margin: '0 auto' }} />
            </div>
        );
    }
}

export default App;
