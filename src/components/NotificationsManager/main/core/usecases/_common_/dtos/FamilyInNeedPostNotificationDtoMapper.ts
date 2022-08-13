import { FamilyInNeedPostNotification } from '../../../domain/FamilyInNeedPostNotification';

import { FamilyInNeedPostNotificationDto } from './FamilyInNeedPostNotificationDto';

import { NotificationDtoMapper } from './base/NotificationDtoMapper';

class FamilyInNeedPostNotificationDtoMapper extends NotificationDtoMapper {
    static toDto(notification: FamilyInNeedPostNotification): FamilyInNeedPostNotificationDto {
        return {
            ...super.toDto(notification),
            notification: {
                ...super.toDto(notification).notification,

                postId: notification.postId.value(),
                reason: notification.reason,
            },
        };
    }
}

export { FamilyInNeedPostNotificationDtoMapper };