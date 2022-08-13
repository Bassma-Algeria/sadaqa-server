import { FamilyInNeedPostNotificationDto } from './FamilyInNeedPostNotificationDto';

import { FamilyInNeedPostNotification } from '../../../domain/FamilyInNeedPostNotification';

class FamilyInNeedPostNotificationDtoMapper {
    static toDto(notification: FamilyInNeedPostNotification): FamilyInNeedPostNotificationDto {
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

export { FamilyInNeedPostNotificationDtoMapper };