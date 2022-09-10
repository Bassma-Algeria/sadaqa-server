import { Message } from '../../../Message';

export interface MessageEventPublisher<M extends Message> {
    publishMessageSent(message: M): void;

    publishMessageRead(message: M): void;
}