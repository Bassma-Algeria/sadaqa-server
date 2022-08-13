import { DonationPostNotification } from '../../../domain/DonationPostNotification';

class DonationPostNotificationDto {
    static toDto(notification: DonationPostNotification) {
        return {
            type: notification.type,
            notification: {
                notificationId: notification.notificationId.value(),
                postId: notification.postId.value(),
                receiverId: notification.receiverId.value(),
                reason: notification.reason,
                read: notification.read,
                clicked: notification.clicked,
                createdAt: notification.createdAt,
            },
        };
    }
}

export { DonationPostNotificationDto };