import { Notification } from './Notification';
import { NotificationId } from './NotificationId';
import { UserId } from './UserId';
import { NotificationType } from './NotificationType';
import { TextMessageNotificationBuilder } from './TextMessageNotificationBuilder';

class TextMessageNotification extends Notification {
    readonly type = NotificationType.NEW_TEXT_MESSAGE;

    constructor(
        readonly notificationId: NotificationId,
        readonly receiverId: UserId,
        readonly messageSenderId: UserId,
        readonly messageContent: string,
        readonly clicked: boolean,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {
        super(
            notificationId,
            receiverId,
            NotificationType.NEW_TEXT_MESSAGE,
            clicked,
            read,
            createdAt,
        );
    }

    static aBuilder() {
        return new TextMessageNotificationBuilder();
    }

    static aBuilderFrom(notification: TextMessageNotification) {
        return new TextMessageNotificationBuilder(notification);
    }

    protected aBuilderFromThis() {
        return TextMessageNotification.aBuilderFrom(this);
    }
}

export { TextMessageNotification };
