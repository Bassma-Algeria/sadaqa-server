import { UserId } from './UserId';
import { PostId } from './PostId';
import { NotificationId } from './NotificationId';
import { PostNotificationReason } from './PostNotificationReason';

import { DonationPostNotification } from './DonationPostNotification';

class DonationPostNotificationBuilder {
    private notificationId!: NotificationId;
    private receiverId!: UserId;
    private postId!: PostId;
    private reason!: PostNotificationReason;
    private clicked!: boolean;
    private read!: boolean;
    private createdAt!: Date;

    constructor(postNotification?: DonationPostNotification) {
        if (!postNotification) return;

        this.notificationId = postNotification.notificationId;
        this.postId = postNotification.postId;
        this.receiverId = postNotification.receiverId;
        this.reason = postNotification.reason;
        this.clicked = postNotification.clicked;
        this.read = postNotification.read;
        this.createdAt = postNotification.createdAt;
    }

    withId(notificationId: NotificationId) {
        this.notificationId = notificationId;
        return this;
    }

    withReceiverId(receiverId: UserId) {
        this.receiverId = receiverId;
        return this;
    }

    withPostId(postId: PostId) {
        this.postId = postId;
        return this;
    }

    withReason(resaon: PostNotificationReason) {
        this.reason = resaon;
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

    build() {
        return new DonationPostNotification(
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

export { DonationPostNotificationBuilder };