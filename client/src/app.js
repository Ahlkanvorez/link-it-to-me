import React from 'react';
import axios from 'axios';
import './react-datetime.css'
import MessageList from './messages.js';
import MessageForm from './messageForm.js';
import Navbar from './components/Navbar';
import MessageLinkInfo from './components/MessageLinkInfo';

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
            username: '',
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
        axios.post('/', message).then(res => {
            this.setState({
                id: res.data.id,
                messageContent: res.data.content
            });
        }).catch(err => console.error(err));
    }

    updateMessages () {
        // If already anonymous, continue anonymously.
        if (this.state.username !== 'Anonymous') {
            axios.get('/messages').then(res => {
                if (res) {
                    this.setState({
                        username: res.data.username,
                        messages: res.data.messages || []
                    });
                }
            }).catch(err => {
                // If the user information cannot be gathered from the server, proceed anonymously.
                this.setState({
                    username: "Anonymous",
                    messages: []
                });
                console.error(err)
            });
        }
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
