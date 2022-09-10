import { UserId } from './UserId';
import { Message } from './Message';
import { MessageId } from './MessageId';
import { TextMessageContent } from './TextMessageContent';

import { TextMessageBuilder } from './TextMessageBuilder';

class TextMessage extends Message {
    constructor(
        readonly messageId: MessageId,
        readonly senderId: UserId,
        readonly receiverId: UserId,
        readonly content: TextMessageContent,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {
        super(messageId, senderId, receiverId, read, createdAt);
    }

    static aBuilder() {
        return new TextMessageBuilder();
    }

    static aBuilderFrom(message: TextMessage) {
        return new TextMessageBuilder(message);
    }

    protected aBuilderFromThis() {
        return TextMessage.aBuilderFrom(this);
    }
}

export { TextMessage };