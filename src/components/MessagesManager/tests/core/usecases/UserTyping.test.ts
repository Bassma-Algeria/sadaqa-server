import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

import { aMessagesManager } from './base/aMessagesManager';

describe('User Typing', () => {
    const messagesManager = aMessagesManager();

    it('given a user start typing in a conversation, then publish a user typing event in the global event bus', async () => {
        const mockFn = spy();

        EventBus.getInstance().subscribeTo('USER_START_TYPING').by(mockFn);

        const userId = faker.datatype.uuid();
        const receiverId = faker.datatype.uuid();

        await messagesManager.userStartTyping({ userId, receiverId });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('userId', userId);
        expect(mockFn.args[0][0]).to.have.property('receiverId', receiverId);
    });

    it('given a user stop typing in a conversation, then publish a user stop typing event in the global event bus', async () => {
        const mockFn = spy();

        EventBus.getInstance().subscribeTo('USER_STOP_TYPING').by(mockFn);

        const userId = faker.datatype.uuid();
        const receiverId = faker.datatype.uuid();

        await messagesManager.userStopTyping({ userId, receiverId });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('userId', userId);
        expect(mockFn.args[0][0]).to.have.property('receiverId', receiverId);
    });
});