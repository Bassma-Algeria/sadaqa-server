import { Notification } from '../../../../domain/Notification';

import { NotificationDto } from './NotificationDto';

abstract class NotificationDtoMapper {
    static toDto(notification: Notification): NotificationDto {
        return {
            type: notification.type,
            notification: {
                notificationId: notification.notificationId.value(),
                receiverId: notification.receiverId.value(),
                read: notification.read,
                clicked: notification.clicked,
                createdAt: notification.createdAt,
            },
        };
    }
}

export { NotificationDtoMapper };