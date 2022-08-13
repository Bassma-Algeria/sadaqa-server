import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { PostNotificationReason } from './PostNotificationReason';

import { DonationPostNotificationBuilder } from './DonationPostNotificationBuilder';

class DonationPostNotification {
    readonly type = NotificationType.NEW_DONATION_POST;

    constructor(
        readonly notificationId: NotificationId,
        readonly receiverId: UserId,
        readonly postId: PostId,
        readonly reason: PostNotificationReason,
        readonly clicked: boolean,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {}

    static aBuilder() {
        return new DonationPostNotificationBuilder();
    }

    static aBuilderFrom(notification: DonationPostNotification) {
        return new DonationPostNotificationBuilder(notification);
    }
}

export { DonationPostNotification };