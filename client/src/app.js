import React from 'react';
import axios from 'axios';
import './react-datetime.css'
import MessageList from './messages.js';
import MessageForm from './messageForm.js';

const baseUrl = 'http://localhost:3001';
const http = axios.create({ baseURL: baseUrl });

const Navbar = ({ username }) => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <a className="navbar-brand">
                    {username}
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

const MessageLinkInfo = ({ id, messageContent }) => (
    <div>
        { id ? (
            <div style={{ display: 'table', margin: '0 auto', paddingTop: '30px' }}>
                <p>
                    <a href={`/view/${id}`}>This link</a> will take you to your secret message, but
                    be careful! If you cause it to self-destruct before your intended recipient can see it,
                    you'll have to make another!
                </p>
                <blockquote>
                    {messageContent}
                </blockquote>
            </div>
        ) : null}
    </div>
);

const LoginStatusWarning = ({ username }) => (
    <div>
        { username === 'Anonymous'
            ? (
                <p>
                    Warning: it seems you are sending messages anonymously. That's fine if it's what you want, but keep
                    in mind that you cannot recover or view your messages if you lose them. If you login, you can view
                    any messages (at least until they explode) that you make while logged in.
                </p>
            )
            : null
        }
    </div>
);

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: 'Anonymous',
            messages: []
        };

        this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage= this.sendMessage.bind(this);
    }

    componentDidMount () {
        this.updateMessages();
    }
    
    handleMessageSubmit (message) {
        this.sendMessage(message);
        this.updateMessages();
    }

    sendMessage (message) {
        http.post('/', message).then(res => {
            this.setState({
                id: res.data.id,
                messageContent: res.data.content
            });
        }).catch(err => {
            console.log(err);
        });
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
        const { username, messages, id, messageContent } = this.state;
        return (
            <div className="container">
                <div className="row"
                     style={{ display: 'table', margin: '0 auto' }}>
                    <Navbar username={username} />
                </div>
                <div className="row" style={{ marginTop: '60px' }}>
                    <div className="col-lg-6">
                        <MessageForm onSubmit={this.handleMessageSubmit} />
                        <MessageLinkInfo id={id} messageContent={messageContent} />
                        <LoginStatusWarning username={username} />
                    </div>
                    <MessageList className="col-lg-6" messages={messages} />
                </div>
            </div>
        );
    }
}

export default App;
