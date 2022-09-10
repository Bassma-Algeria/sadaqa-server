import { PostId } from './PostId';
import { PostNotificationReason } from './PostNotificationReason';

import { NotificationBuilder } from './NotificationBuilder';
import { CallForHelpPostNotification } from './CallForHelpPostNotification';

class CallForHelpPostNotificationBuilder extends NotificationBuilder {
    private postId!: PostId;
    private reason!: PostNotificationReason;

    constructor(postNotification?: CallForHelpPostNotification) {
        super(postNotification);

        if (!postNotification) return;

        this.postId = postNotification.postId;
        this.reason = postNotification.reason;
    }

    withPostId(postId: PostId) {
        this.postId = postId;
        return this;
    }

    withReason(reason: PostNotificationReason) {
        this.reason = reason;
        return this;
    }

    build() {
        return new CallForHelpPostNotification(
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

export { CallForHelpPostNotificationBuilder };