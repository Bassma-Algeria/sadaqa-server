import { MessageId } from '../MessageId';

export interface MessageIdGenerator {
    nextId(): MessageId;
}