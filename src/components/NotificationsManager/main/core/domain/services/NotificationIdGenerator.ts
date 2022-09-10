import { NotificationId } from '../NotificationId';

export interface NotificationIdGenerator {
    nextId(): NotificationId;
}