import { spy } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aMessagesManager } from './base/aMessagesManager';

import { InMemoryEventBus } from '../../../../EventBus/main/InMemoryEventBus';

describe('User Typing', () => {
    const messagesManager = aMessagesManager();

    it('given a user start typing in a conversation, then publish a user typing event in the global event bus', async () => {
        const mockFn = spy();

        InMemoryEventBus.instance().subscribeTo('USER_START_TYPING').by(mockFn);

        const userId = faker.datatype.uuid();
        const receiverId = faker.datatype.uuid();

        await messagesManager.userStartTyping({ userId, receiverId });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('userId', userId);
        expect(mockFn.args[0][0]).to.have.property('receiverId', receiverId);
    });

    it('given a user stop typing in a conversation, then publish a user stop typing event in the global event bus', async () => {
        const mockFn = spy();

        InMemoryEventBus.instance().subscribeTo('USER_STOP_TYPING').by(mockFn);

        const userId = faker.datatype.uuid();
        const receiverId = faker.datatype.uuid();

        await messagesManager.userStopTyping({ userId, receiverId });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('userId', userId);
        expect(mockFn.args[0][0]).to.have.property('receiverId', receiverId);
    });
});
