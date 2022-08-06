import { expect } from 'chai';

import { aMessagesManager } from './base/aMessagesManager';
import { faker } from '@faker-js/faker';
import { aSendTextMessageRequest } from './base/requests/aSendTextMessageRequest';

describe('Get Conversation', () => {
    const messagesManager = aMessagesManager();

    it("given a get conversation request, when the chat participants doesn't have any messages, then return an empty list", async () => {
        const { messages } = await messagesManager.getConversation({
            between: 'SOME_ID',
            and: 'ANOTHER_ID',
        });

        expect(messages).to.have.lengthOf(0);
    });

    it('given a get conversation request, when there is some messages between the chat participants, then return the list of those messages ordered by createdAt descending', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 2, senderId: secondUser, receiverId: firstUser });
        await sendMessages({ total: 1, senderId: firstUser, receiverId: secondUser });

        const { messages } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
        });

        expect(messages).to.have.lengthOf(3);

        expect(messages[0].message.createdAt.getTime())
            .to.be.greaterThan(messages[1].message.createdAt.getTime())
            .and.to.be.greaterThan(messages[2].message.createdAt.getTime());
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, then return the list page per page, 20 one a time', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 20, senderId: secondUser, receiverId: firstUser });
        await sendMessages({ total: 20, senderId: firstUser, receiverId: secondUser });

        const { messages } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
        });

        expect(messages).to.have.lengthOf(20);
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, and no page specified in the request, then return first page by default', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 10, senderId: secondUser, receiverId: firstUser });
        await sendMessages({ total: 15, senderId: firstUser, receiverId: secondUser });

        const lastMessage = await messagesManager.sendTextMessage(
            aSendTextMessageRequest({
                senderId: firstUser,
                receiverId: secondUser,
            }),
        );

        const { messages } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
        });

        expect(messages[0].message.messageId).to.equal(lastMessage.messageId);
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, then should return any specific page', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        const messageTwentyOne = await messagesManager.sendTextMessage(
            aSendTextMessageRequest({
                senderId: firstUser,
                receiverId: secondUser,
            }),
        );

        await sendMessages({ total: 20, senderId: firstUser, receiverId: secondUser });

        const { messages } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
            page: 2,
        });

        expect(messages[0].message.messageId).to.equal(messageTwentyOne.messageId);
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, then know if we are at the last page or not', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 30, senderId: firstUser, receiverId: secondUser });

        const { end: end1 } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
            page: 1,
        });
        const { end: end2 } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
            page: 2,
        });

        expect(end1).to.equal(false);
        expect(end2).to.equal(true);
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, then should return the current page we are in', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 30, senderId: firstUser, receiverId: secondUser });

        const { page: page1 } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
            page: 1,
        });
        const { page: page2 } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
            page: 2,
        });

        expect(page1).to.equal(1);
        expect(page2).to.equal(2);
    });

    it('given a get conversation request, when there are a lot of messages between the chat participants, then should return the total number of messages', async () => {
        const firstUser = faker.datatype.uuid();
        const secondUser = faker.datatype.uuid();

        await sendMessages({ total: 30, senderId: firstUser, receiverId: secondUser });

        const { total } = await messagesManager.getConversation({
            between: firstUser,
            and: secondUser,
        });

        expect(total).to.equal(30);
    });

    async function sendMessages(args: { total: number; senderId: string; receiverId: string }) {
        const { total, senderId, receiverId } = args;

        for (const _ of Array.from({ length: total }))
            await messagesManager.sendTextMessage(
                aSendTextMessageRequest({ senderId, receiverId }),
            );
    }
});