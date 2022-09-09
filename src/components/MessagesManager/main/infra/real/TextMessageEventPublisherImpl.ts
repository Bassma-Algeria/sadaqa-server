import { UserId } from '../../core/domain/UserId';
import { TextMessage } from '../../core/domain/TextMessage';

import { TextMessageEventPublisher } from '../../core/domain/services/MessageEventPublisher/TextMessageEventPublisher';

import { EventBus } from '../../../../EventBus/main/EventBus';

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
            receiverId: message.receiverId.value(),
            senderId: message.senderId.value(),
        });
    }

    publishUserStartTypingEvent(userId: UserId, receiverId: UserId): void {
        this.eventBus.publish('USER_START_TYPING').withPayload({
            userId: userId.value(),
            receiverId: receiverId.value(),
        });
    }

    publishUserStopTypingEvent(userId: UserId, receiverId: UserId): void {
        this.eventBus.publish('USER_STOP_TYPING').withPayload({
            userId: userId.value(),
            receiverId: receiverId.value(),
        });
    }
}

export { TextMessageEventPublisherImpl };
