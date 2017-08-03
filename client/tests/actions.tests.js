import * as actions from '../src/actions';

describe('actions', () => {
    it('Should create an action to set the message content', () => {
        const content = 'This is some message content';
        const expectedAction = { type: actions.SET_MESSAGE_CONTENT, content };
        expect(actions.setMessageContent(content)).toEqual(expectedAction);
    });
});
