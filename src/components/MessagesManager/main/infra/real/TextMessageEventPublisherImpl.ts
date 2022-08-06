import { TextMessage } from '../../core/domain/TextMessage';

import { TextMessageEventPublisher } from '../../core/domain/services/MessageEventPublisher/TextMessageEventPublisher';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class TextMessageEventPublisherImpl implements TextMessageEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishMessageSent(message: TextMessage): void {
        this.eventBus.publish('TEXT_MESSAGE_SENT').withPayload({
            messageId: message.messageId.value(),
            receiverId: message.receiverId.value(),
            content: message.content.value(),
            senderId: message.senderId.value(),
            read: message.read,
            createdAt: message.createdAt,
        });
    }

    publishMessageRead(message: TextMessage) {
        this.eventBus.publish('MESSAGE_READ').withPayload({
            messageId: message.messageId.value(),
        });
    }
}

export { TextMessageEventPublisherImpl };