import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { PostNotificationReason } from './PostNotificationReason';

import { FamilyInNeedPostNotificationBuilder } from './FamilyInNeedPostNotificationBuilder';

import { Notification } from './Notification';

class FamilyInNeedPostNotification extends Notification {
    readonly type = NotificationType.NEW_FAMILY_IN_NEED_POST;

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
            NotificationType.NEW_FAMILY_IN_NEED_POST,
            clicked,
            read,
            createdAt,
        );
    }

    static aBuilder() {
        return new FamilyInNeedPostNotificationBuilder();
    }

    static aBuilderFrom(notification: FamilyInNeedPostNotification) {
        return new FamilyInNeedPostNotificationBuilder(notification);
    }

    protected aBuilderFromThis() {
        return FamilyInNeedPostNotification.aBuilderFrom(this);
    }
}

export { FamilyInNeedPostNotification };