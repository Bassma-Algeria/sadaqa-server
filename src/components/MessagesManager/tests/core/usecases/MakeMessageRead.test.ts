import { spy } from 'sinon';
import { expect } from 'chai';

import { aMessagesManager } from './base/aMessagesManager';
import { aSendTextMessageRequest } from './base/requests/aSendTextMessageRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Make Message Read', () => {
    const messagesManager = aMessagesManager();

    it('given a make message read request, then only the receiver can make the message read', async () => {
        const { messageId } = await messagesManager.sendTextMessage(aSendTextMessageRequest());

        await expect(messagesManager.makeMessageRead({ messageId, userId: 'NOT_RECEIVER' }))
            .to.eventually.be.rejectedWith(ExceptionMessages.ONLY_MESSAGE_RECEIVER_CAN_MAKE_IT_READ)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a make message read request, then the message should exsit', async () => {
        await expect(
            messagesManager.makeMessageRead({ messageId: 'NOT_EXIST', userId: 'SOME_USER' }),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.MESSAGE_NOT_FOUND)
            .and.to.be.an.instanceof(NotFoundException);
    });

    it('given a make message read request, when everything is ok, then should update the read status of that message', async () => {
        const message = aSendTextMessageRequest();
        const { messageId } = await messagesManager.sendTextMessage(message);

        await messagesManager.makeMessageRead({ messageId, userId: message.receiverId });

        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(messages[0].message.read).to.equal(true);
    });

    it('given a make message read request, when the message is already read, then should fail', async () => {
        const message = aSendTextMessageRequest();
        const { messageId } = await messagesManager.sendTextMessage(message);

        await messagesManager.makeMessageRead({ messageId, userId: message.receiverId });

        await expect(messagesManager.makeMessageRead({ messageId, userId: message.receiverId }))
            .to.eventually.be.rejectedWith(ExceptionMessages.MESSAGE_ALREADY_READ)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a make message read request, when everything is ok, then should publish a message read event to the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('MESSAGE_READ').by(mockFn);

        const message = aSendTextMessageRequest();
        const { messageId } = await messagesManager.sendTextMessage(message);

        await messagesManager.makeMessageRead({ messageId, userId: message.receiverId });

        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('messageId', messages[0].message.messageId);
    });
});