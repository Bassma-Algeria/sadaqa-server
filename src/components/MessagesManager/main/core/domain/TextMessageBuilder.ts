import { MessageBuilder } from './MessageBuilder';

import { TextMessage } from './TextMessage';
import { TextMessageContent } from './TextMessageContent';

class TextMessageBuilder extends MessageBuilder {
    private content!: TextMessageContent;

    constructor(message?: TextMessage) {
        super(message);

        if (!message) return;

        this.content = message.content;
    }

    withContent(content: TextMessageContent) {
        this.content = content;
        return this;
    }

    build(): TextMessage {
        return new TextMessage(
            this.messageId,
            this.senderId,
            this.receiverId,
            this.content,
            this.read,
            this.createdAt,
        );
    }
}

export { TextMessageBuilder };