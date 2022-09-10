import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { PostNotificationReason } from './PostNotificationReason';

import { Notification } from './Notification';
import { DonationPostNotificationBuilder } from './DonationPostNotificationBuilder';

class DonationPostNotification extends Notification {
    readonly type = NotificationType.NEW_DONATION_POST;

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
            NotificationType.NEW_DONATION_POST,
            clicked,
            read,
            createdAt,
        );
    }

    static aBuilder() {
        return new DonationPostNotificationBuilder();
    }

    static aBuilderFrom(notification: DonationPostNotification) {
        return new DonationPostNotificationBuilder(notification);
    }

    protected aBuilderFromThis() {
        return DonationPostNotification.aBuilderFrom(this);
    }
}

export { DonationPostNotification };