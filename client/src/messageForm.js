import React from 'react';
import DateTime from 'react-datetime';
import EditableList from './editableList.js';

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
        const { content, expires, maxAccesses, ipWhitelist } = this.state;
        this.props.onSubmit({ content, expires, maxAccesses, ipWhitelist });
        event.preventDefault();
    }

    render () {
        return (
            <div>
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
            </div>
        );
    }
}

export default MessageForm;