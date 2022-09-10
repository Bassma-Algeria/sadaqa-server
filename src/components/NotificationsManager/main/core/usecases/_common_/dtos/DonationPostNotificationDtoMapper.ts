import { DonationPostNotification } from '../../../domain/DonationPostNotification';

import { NotificationDtoMapper } from './base/NotificationDtoMapper';

import { DonationPostNotificationDto } from './DonationPostNotificationDto';

class DonationPostNotificationDtoMapper extends NotificationDtoMapper {
    static toDto(notification: DonationPostNotification): DonationPostNotificationDto {
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

export { DonationPostNotificationDtoMapper };