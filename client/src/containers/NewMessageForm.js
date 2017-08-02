import { connect } from 'react-redux';
import MessageForm from '../components/MessageForm';
import {
    postMessage,
    setMessageContent,
    setExpirationDate,
    setMaximumAccesses,
    addWhitelistedIp,
    editWhitelistedIp,
    removeWhitelistedIp
} from '../actions';

const mapStateToProps = ({ message }, ownProps) => ({ message });

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: message => {
        dispatch(postMessage(message));
    },
    onContentChange: e => {
        dispatch(setMessageContent(e.target.value));
    },
    onExpiresChange: expirationDate => {
        dispatch(setExpirationDate(expirationDate));
    },
    onMaxAccessesChange: e => {
        dispatch(setMaximumAccesses(e.target.value));
    },
    onAddIp: ip => {
        dispatch(addWhitelistedIp(ip));
    },
    onEditIp: (oldIp, newIp) => {
        dispatch(editWhitelistedIp(oldIp, newIp));
    },
    onRemoveIp: ip => {
        dispatch(removeWhitelistedIp(ip));
    }
});

// For inspiration of implementation, see: 
// - https://github.com/reactjs/react-redux/issues/535
const NewMessageForm = connect(
    mapStateToProps,
    mapDispatchToProps,
    (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        // Note: dispatchProps.onSubmit is available here via closure, but in
        // the component, the below onSubmit is provided.
        onSubmit (event) {
            event.preventDefault();
            dispatchProps.onSubmit(stateProps.message);
        }
    })
)(MessageForm);

export default NewMessageForm;
