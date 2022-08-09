import { UserId } from '../../UserId';
import { TextMessage } from '../../TextMessage';

import { MessageEventPublisher } from './base/MessageEventPublisher';

export interface TextMessageEventPublisher extends MessageEventPublisher<TextMessage> {
    publishUserStartTypingEvent(userId: UserId, receiverId: UserId): void;

    publishUserStopTypingEvent(userId: UserId, receiverId: UserId): void;
}