import { CallForHelpPostNotification } from '../../../domain/CallForHelpPostNotification';

import { NotificationDtoMapper } from './base/NotificationDtoMapper';

import { CallForHelpPostNotificationDto } from './CallForHelpPostNotificationDto';

class CallForHelpPostNotificationDtoMapper extends NotificationDtoMapper {
    static toDto(notification: CallForHelpPostNotification): CallForHelpPostNotificationDto {
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

export { CallForHelpPostNotificationDtoMapper };