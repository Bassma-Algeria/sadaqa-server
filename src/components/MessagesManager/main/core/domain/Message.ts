import { UserId } from './UserId';
import { MessageId } from './MessageId';
import { MessageBuilder } from './MessageBuilder';

abstract class Message {
    protected abstract aBuilderFromThis(): MessageBuilder;

    protected constructor(
        readonly messageId: MessageId,
        readonly senderId: UserId,
        readonly receiverId: UserId,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {}

    makeRead() {
        return this.aBuilderFromThis().withReadStatus(true).build();
    }
}

export { Message };