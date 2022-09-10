import { PostId } from './PostId';
import { PostNotificationReason } from './PostNotificationReason';

import { FamilyInNeedPostNotification } from './FamilyInNeedPostNotification';

import { NotificationBuilder } from './NotificationBuilder';

class FamilyInNeedPostNotificationBuilder extends NotificationBuilder {
    private postId!: PostId;
    private reason!: PostNotificationReason;

    constructor(postNotification?: FamilyInNeedPostNotification) {
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
        return new FamilyInNeedPostNotification(
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

export { FamilyInNeedPostNotificationBuilder };