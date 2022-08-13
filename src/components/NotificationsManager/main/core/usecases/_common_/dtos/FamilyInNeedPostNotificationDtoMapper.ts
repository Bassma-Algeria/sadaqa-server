import { DonationPostNotificationDto } from './DonationPostNotificationDto';

import { DonationPostNotification } from '../../../domain/DonationPostNotification';

class DonationPostNotificationDtoMapper {
    static toDto(notification: DonationPostNotification): DonationPostNotificationDto {
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

export { DonationPostNotificationDtoMapper };