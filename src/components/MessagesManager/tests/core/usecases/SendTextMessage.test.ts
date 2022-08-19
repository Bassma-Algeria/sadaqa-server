import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, deepEqual, instance, mock, when } from 'ts-mockito';

import { aMessagesManager } from './base/aMessagesManager';
import { aSendTextMessageRequest } from './base/requests/aSendTextMessageRequest';

import { UserId } from '../../../main/core/domain/UserId';

import { UsersService } from '../../../main/core/domain/services/UsersService';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../main/core/domain/exceptions/ValidationException';
import { spy } from 'sinon';
import { EventBus } from '../../../../_shared_/event-bus/EventBus';

describe('Send Text Message', () => {
    const mockUsersService = mock<UsersService>();

    const messagesManager = aMessagesManager({ usersService: instance(mockUsersService) });

    beforeEach(() => {
        when(mockUsersService.isExist(anything())).thenResolve(true);
    });

    it("given a text message sending request, when the sender doesn't exist, then should fail", async () => {
        const EXIST = faker.datatype.uuid();
        const NOT_EXIST = faker.datatype.uuid();

        when(mockUsersService.isExist(anything())).thenResolve(true);
        when(mockUsersService.isExist(deepEqual(new UserId(NOT_EXIST)))).thenResolve(false);

        await expect(
            messagesManager.sendTextMessage(
                aSendTextMessageRequest({ receiverId: EXIST, senderId: NOT_EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.SENDER_NOT_EXIST)
            .and.to.be.an.instanceof(ValidationException);
    });

    it("given a text message sending request, when the receiver doesn't exist, then should fail", async () => {
        const EXIST = faker.datatype.uuid();
        const NOT_EXIST = faker.datatype.uuid();

        when(mockUsersService.isExist(deepEqual(new UserId(EXIST)))).thenResolve(true);
        when(mockUsersService.isExist(deepEqual(new UserId(NOT_EXIST)))).thenResolve(false);

        await expect(
            messagesManager.sendTextMessage(
                aSendTextMessageRequest({ receiverId: NOT_EXIST, senderId: EXIST }),
            ),
        )
            .to.eventually.be.rejectedWith(ExceptionMessages.RECEIVER_NOT_EXIST)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a text message sending request, when the message is empty, then should fail', async () => {
        await expect(messagesManager.sendTextMessage(aSendTextMessageRequest({ message: '' })))
            .to.eventually.be.rejectedWith(ExceptionMessages.TEXT_MESSAGE_CONTENT_CANNOT_BE_EMPTY)
            .and.to.be.an.instanceof(ValidationException);
    });

    it('given a text message sending request, when everything is ok, then should send the message', async () => {
        const message = aSendTextMessageRequest();

        const { messages: messagesBeforeSend } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        await messagesManager.sendTextMessage(message);

        const { messages: messagesAfterSend } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(messagesAfterSend).to.have.lengthOf(messagesBeforeSend.length + 1);
    });

    it('given a text message sending request, when everything is ok, then should trim the message content before saving', async () => {
        const message = aSendTextMessageRequest({ message: ' hello my brother ' });

        await messagesManager.sendTextMessage(message);

        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(messages[0].message.content).to.equal('hello my brother');
    });

    it('given a text message sending request, when everything is ok, then the new message should not be read', async () => {
        const message = aSendTextMessageRequest({ message: ' hello my brother ' });

        await messagesManager.sendTextMessage(message);

        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(messages[0].message.read).to.equal(false);
    });

    it('given a text message sending request, when everything is ok, then the new message should have the createdAt at the time of the creation', async () => {
        const message = aSendTextMessageRequest();

        await messagesManager.sendTextMessage(message);

        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        const ONE_SECOND = 1000;
        expect(new Date().getTime() - messages[0].message.createdAt.getTime()).to.be.lessThan(
            ONE_SECOND,
        );
    });

    it('given a text message sending request, when everything is ok, then the new message should have a unique id', async () => {
        const message = aSendTextMessageRequest();

        const { messageId: id1 } = await messagesManager.sendTextMessage(message);
        const { messageId: id2 } = await messagesManager.sendTextMessage(message);
        const { messageId: id3 } = await messagesManager.sendTextMessage(message);

        expect(id1).to.not.equal(id2).and.to.not.equal(id3);
    });

    it('given a text message sending request, when the message is sent, then the number of unread message for the receiver should increse', async () => {
        const message = aSendTextMessageRequest();

        const { total: totalBefore } = await messagesManager.getUnreadMessagesNumber({
            receiverId: message.receiverId,
        });

        await messagesManager.sendTextMessage(message);

        const { total: totalAfter } = await messagesManager.getUnreadMessagesNumber({
            receiverId: message.receiverId,
        });

        expect(totalAfter).to.equal(totalBefore + 1);
    });

    it('given a text message sending request, when everything is ok, then should publish the message sent event in the global event bus', async () => {
        const mockFn = spy();
        EventBus.getInstance().subscribeTo('TEXT_MESSAGE_SENT').by(mockFn);

        const message = aSendTextMessageRequest();
        await messagesManager.sendTextMessage(message);
        const { messages } = await messagesManager.getConversation({
            between: message.senderId,
            and: message.receiverId,
        });

        expect(mockFn.calledOnce).to.equal(true);
        expect(mockFn.args[0][0]).to.have.property('messageId', messages[0].message.messageId);
    });
});
