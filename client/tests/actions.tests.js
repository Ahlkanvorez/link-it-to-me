import * as actions from '../src/actions';

describe('actions', () => {
    it('Should create an action to set the message content', () => {
        const content = 'This is some message content';
        const expectedAction = {
            type: actions.SET_MESSAGE_CONTENT,
            content
        };
        expect(actions.setMessageContent(content))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the message content to \'\' when not' +
    ' given a content string.', () => {
        const expectedAction = {
            type: actions.SET_MESSAGE_CONTENT,
            content: ''
        };
        expect(actions.setMessageContent())
            .toEqual(expectedAction);
    });

    it('Should create an action to set the expiration date', () => {
        const expirationDate = new Date();
        const expectedAction = {
            type: actions.SET_EXPIRATION_DATE,
            expirationDate
        };
        expect(actions.setExpirationDate(expirationDate))
            .toEqual(expectedAction);
    });

    it('Should create an action to set the expiration date to a date one day '
    + 'ahead of the current date, if not given an expiration date.', () => {
        const result = actions.setExpirationDate();
        expect(result.type)
            .toEqual(actions.SET_EXPIRATION_DATE);

        // Ensure that the resulting date is between 23 and 25 hours in the
        // future, i.e. roughly tomorrow.
        const post23Hours = new Date(Date.now() + 1000 * 60 * 60 * 23);
        const post25Hours = new Date(Date.now() + 1000 * 60 * 60 * 25);
        expect(post23Hours < result.expirationDate)
            .toBeTruthy();
        expect(result.expirationDate < post25Hours)
            .toBeTruthy();
    });
});
