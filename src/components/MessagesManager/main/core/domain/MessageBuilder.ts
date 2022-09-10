import { UserId } from './UserId';
import { Message } from './Message';
import { MessageId } from './MessageId';

abstract class MessageBuilder {
    abstract build(): any;

    protected messageId!: MessageId;
    protected senderId!: UserId;
    protected receiverId!: UserId;
    protected read!: boolean;
    protected createdAt!: Date;

    protected constructor(message?: Message) {
        if (!message) return;

        this.messageId = message.messageId;
        this.senderId = message.senderId;
        this.receiverId = message.receiverId;
        this.read = message.read;
        this.createdAt = message.createdAt;
    }

    withMessageId(messageId: MessageId) {
        this.messageId = messageId;
        return this;
    }

    withSenderId(id: UserId) {
        this.senderId = id;
        return this;
    }

    withReceiverId(id: UserId) {
        this.receiverId = id;
        return this;
    }

    withReadStatus(read: boolean) {
        this.read = read;
        return this;
    }

    withCreatedAt(createdAt: Date) {
        this.createdAt = createdAt;
        return this;
    }
}

export { MessageBuilder };