import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { PostNotificationReason } from './PostNotificationReason';

import { CallForHelpPostNotificationBuilder } from './CallForHelpPostNotificationBuilder';

import { Notification } from './Notification';

class CallForHelpPostNotification extends Notification {
    readonly type = NotificationType.NEW_CALL_FOR_HELP_POST;

    constructor(
        readonly notificationId: NotificationId,
        readonly receiverId: UserId,
        readonly postId: PostId,
        readonly reason: PostNotificationReason,
        readonly clicked: boolean,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {
        super(
            notificationId,
            receiverId,
            NotificationType.NEW_CALL_FOR_HELP_POST,
            clicked,
            read,
            createdAt,
        );
    }

    static aBuilder() {
        return new CallForHelpPostNotificationBuilder();
    }

    static aBuilderFrom(notification: CallForHelpPostNotification) {
        return new CallForHelpPostNotificationBuilder(notification);
    }

    protected aBuilderFromThis() {
        return CallForHelpPostNotification.aBuilderFrom(this);
    }
}

export { CallForHelpPostNotification }; 