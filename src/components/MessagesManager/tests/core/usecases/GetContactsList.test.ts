import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aMessagesManager } from './base/aMessagesManager';
import { aSendTextMessageRequest } from './base/requests/aSendTextMessageRequest';

describe('Get Contacts List', () => {
    const messagesManager = aMessagesManager();

    it('given a get contacts list request, when the user never send a message to anyone, then should return an empty list', async () => {
        const userId = faker.datatype.uuid();

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(0);
    });

    it('given a get contacts list request, when the user send a message to someone, then should have that person in the contacts list', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId = faker.datatype.uuid();

        await sendMessages({ total: 1, senderId: userId, receiverId: anotherUserId });

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(1);
        expect(contacts[0].userId).to.equal(anotherUserId);
    });

    it('given a get contacts list request, when the user send a lot of messages to someone, then should return the latest message sent', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId = faker.datatype.uuid();

        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId });
        const { messageId: latestMessageId } = await messagesManager.sendTextMessage(
            aSendTextMessageRequest({ senderId: userId, receiverId: anotherUserId }),
        );

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(1);
        expect(contacts[0].latestMessage.message.messageId).to.equal(latestMessageId);
    });

    it('given a get contacts list request, when another user send a message of our target user, then should have that user in the contacts list of the target', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId = faker.datatype.uuid();

        await sendMessages({ total: 1, receiverId: userId, senderId: anotherUserId });

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(1);
        expect(contacts[0].userId).to.equal(anotherUserId);
    });

    it('given a get contacts list request, when another user send a lot of messages of our target user, then should return the latest message sent', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId = faker.datatype.uuid();

        await sendMessages({ total: 2, receiverId: userId, senderId: anotherUserId });
        const { messageId: latestMessageId } = await messagesManager.sendTextMessage(
            aSendTextMessageRequest({ receiverId: userId, senderId: anotherUserId }),
        );

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(1);
        expect(contacts[0].latestMessage.message.messageId).to.equal(latestMessageId);
    });

    it('given a get contacts list request, when the user have a conversation with another user, then should return the latest message sent in that conversation', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId = faker.datatype.uuid();

        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId });
        await sendMessages({ total: 1, receiverId: userId, senderId: anotherUserId });
        const { messageId: latestMessageId } = await messagesManager.sendTextMessage(
            aSendTextMessageRequest({ receiverId: userId, senderId: anotherUserId }),
        );

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(1);
        expect(contacts[0].latestMessage.message.messageId).to.equal(latestMessageId);
    });

    it('given a get contacts list request, when the user have a conversation with multiple users, then should return all those users in the contacts list', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId1 = faker.datatype.uuid();
        const anotherUserId2 = faker.datatype.uuid();

        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId1 });
        await sendMessages({ total: 1, senderId: anotherUserId2, receiverId: userId });
        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId2 });
        await sendMessages({ total: 1, senderId: anotherUserId1, receiverId: userId });

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts).to.have.lengthOf(2);
    });

    it('given a get contacts list request, when the user have a conversation with multiple users, then should return all those users in the contacts list ordered by the latest message sent', async () => {
        const userId = faker.datatype.uuid();
        const anotherUserId1 = faker.datatype.uuid();
        const anotherUserId2 = faker.datatype.uuid();
        const anotherUserId3 = faker.datatype.uuid();

        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId1 });
        await sendMessages({ total: 2, senderId: anotherUserId2, receiverId: userId });
        await sendMessages({ total: 2, senderId: userId, receiverId: anotherUserId3 });

        const { contacts } = await messagesManager.getContactsList({ userId });

        expect(contacts[0].latestMessage.message.createdAt.getTime())
            .to.be.greaterThan(contacts[1].latestMessage.message.createdAt.getTime())
            .and.to.be.greaterThan(contacts[2].latestMessage.message.createdAt.getTime());
    });

    async function sendMessages(args: { total: number; senderId: string; receiverId: string }) {
        const { total, senderId, receiverId } = args;

        for (const _ of Array.from({ length: total }))
            await messagesManager.sendTextMessage(
                aSendTextMessageRequest({ senderId, receiverId }),
            );
    }
});