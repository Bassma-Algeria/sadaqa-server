import { PostId } from './PostId';
import { PostNotificationReason } from './PostNotificationReason';
import { DonationRequestPostNotification } from './DonationRequestPostNotification';

import { NotificationBuilder } from './NotificationBuilder';

class DonationRequestPostNotificationBuilder extends NotificationBuilder {
    private postId!: PostId;
    private reason!: PostNotificationReason;

    constructor(postNotification?: DonationRequestPostNotification) {
        super(postNotification);

        if (!postNotification) return;

        this.postId = postNotification.postId;
        this.reason = postNotification.reason;
    }

    withPostId(postId: PostId) {
        this.postId = postId;
        return this;
    }

    withReason(resaon: PostNotificationReason) {
        this.reason = resaon;
        return this;
    }

    build() {
        return new DonationRequestPostNotification(
            this.notificationId,
            this.receiverId,
            this.postId,
            this.reason,
            this.clicked,
            this.read,
            this.createdAt,
        );
    }
}

export { DonationRequestPostNotificationBuilder };