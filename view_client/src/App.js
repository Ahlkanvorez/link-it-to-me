import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const MessageView = ({ creator, message }) => (
    <div>
        <h3>{ creator }</h3>
        <blockquote>{ message }</blockquote>
    </div>
);

class ToggleableView extends Component {
    constructor (props) {
        super(props);
        this.state = { toggle: false };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.setState({ toggle: !this.state.toggle });
        this.props.onToggle();
    }

    render () {
        return (
            <div className="col-lg-12">
                {
                    this.state.toggle
                        ? (this.props.children)
                        : <input type="button" onClick={() => this.handleClick()} value={this.props.toggleText} />
                }
            </div>
        );
    }
}

const Navbar = () => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand">
                    Secret Message
                </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <li>
                        <a href="/auth/login">
                            Login
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

class View extends Component {
    constructor (props) {
        super(props);
        this.state = { content: '', creator: '' };

        this.downloadMessage = this.downloadMessage.bind(this);
    }

    downloadMessage () {
        axios.get(`/message/${this.props.match.params.id}`)
            .then(({data: { content, creator }}) => {
                this.setState({
                    content: content || 'The message already exploded. Sorry!',
                    creator: creator || 'Boom!'});
            })
            .catch(err => {
                console.error(err);
                alert('Something went wrong while downloading the message.');
            });
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{ display: 'table', margin: '0 auto' }}>
                    <Navbar />
                </div>
                <div className="row" style={{ marginTop: '60px' }}>
                    <ToggleableView toggleText="View Message" onToggle={this.downloadMessage}>
                        <MessageView message={this.state.content} creator={this.state.creator} />
                    </ToggleableView>
                </div>
            </div>
        );
    }
}

const App = () => (
    <Router>
        <Route path="/view/:id" component={View} />
    </Router>
);

export default App;
