import React from 'react';

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

export default EditableList;