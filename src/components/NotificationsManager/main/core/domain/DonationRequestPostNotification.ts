import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { PostNotificationReason } from './PostNotificationReason';
import { DonationRequestPostNotificationBuilder } from './DonationRequestPostNotificationBuilder';

import { Notification } from './Notification';

class DonationRequestPostNotification extends Notification {
    readonly type = NotificationType.NEW_DONATION_REQUEST_POST;

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
            NotificationType.NEW_DONATION_REQUEST_POST,
            clicked,
            read,
            createdAt,
        );
    }

    static aBuilder() {
        return new DonationRequestPostNotificationBuilder();
    }

    static aBuilderFrom(notification: DonationRequestPostNotification) {
        return new DonationRequestPostNotificationBuilder(notification);
    }

    protected aBuilderFromThis() {
        return DonationRequestPostNotification.aBuilderFrom(this);
    }
}

export { DonationRequestPostNotification }; 