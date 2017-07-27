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

export default RemovableListInput;