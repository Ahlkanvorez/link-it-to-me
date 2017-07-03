import React from 'react';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            content: '',
            expires: new Date(),
            maxAccesses: 1,
            id: undefined
        };

        this.handleMaxAccessesChange = this.handleMaxAccessesChange.bind(this);
        this.handleExpiresChange = this.handleExpiresChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleContentChange (event) {
        this.setState({ content: event.target.value, id: undefined });
    }

    handleExpiresChange (event) {
        this.setState({ expires: event.target.value, id: undefined });
    }

    handleMaxAccessesChange (event) {
        this.setState({ maxAccesses: event.target.value, id: undefined });
    }

    handleSubmit (event) {
        // Send a post request to the server asynchronously.
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/', true); // true = use async
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const res = JSON.parse(xhr.response);
                if (res.id) {
                    this.setState({ id: res.id });
                } else {
                    this.setState({ id: undefined });
                }
            }
        };
        xhr.send(JSON.stringify(this.state));

        event.preventDefault();
    }

    render () {
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Secure communique:</legend>
                    <textarea value={this.state.content} onChange={this.handleContentChange} placeholder="Secure message" />
                    <br />
                    <label>
                        Self-destruct on:
                    </label>
                    <input type="date"
                           value={this.state.expires}
                           onChange={this.handleExpiresChange} />

                    <br />
                    <label>
                        Number of accesses before self-destruct:
                    </label>
                    <input type="number"
                           min="1"
                           style={{ width: '4em' }}
                           value={this.state.maxAccesses}
                           onChange={this.handleMaxAccessesChange} />

                </fieldset>
                <input type="submit" value="submit" />
                { this.state.id ? (
                    <p>
                        The following link will take you to your secret communique, but be careful! If you cause it to
                        self-destruct before your intended recipient can see it, you'll have to make another!
                        <a href={`/view/${this.state.id}`}>{this.state.id}</a>
                    </p>
                ) : null}
            </form>
        );
    }
}

export default App;
