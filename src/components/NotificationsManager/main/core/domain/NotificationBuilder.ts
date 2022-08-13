import { UserId } from './UserId';
import { NotificationId } from './NotificationId';

import { Notification } from './Notification';

abstract class NotificationBuilder {
    abstract build(): any;

    protected notificationId!: NotificationId;
    protected receiverId!: UserId;
    protected clicked!: boolean;
    protected read!: boolean;
    protected createdAt!: Date;

    protected constructor(notification?: Notification) {
        if (!notification) return;

        this.notificationId = notification.notificationId;
        this.receiverId = notification.receiverId;
        this.clicked = notification.clicked;
        this.read = notification.read;
        this.createdAt = notification.createdAt;
    }

    withId(notificationId: NotificationId) {
        this.notificationId = notificationId;
        return this;
    }

    withReceiverId(receiverId: UserId) {
        this.receiverId = receiverId;
        return this;
    }

    withClicked(isClicked: boolean) {
        this.clicked = isClicked;
        return this;
    }

    withRead(isRead: boolean) {
        this.read = isRead;
        return this;
    }

    withCreatedAt(creationTime: Date) {
        this.createdAt = creationTime;
        return this;
    }
}

export { NotificationBuilder };