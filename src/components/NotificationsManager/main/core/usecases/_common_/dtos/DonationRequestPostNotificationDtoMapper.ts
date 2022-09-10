import { DonationRequestPostNotification } from '../../../domain/DonationRequestPostNotification';

import { NotificationDtoMapper } from './base/NotificationDtoMapper';

import { DonationRequestPostNotificationDto } from './DonationRequestPostNotificationDto';

class DonationRequestPostNotificationDtoMapper extends NotificationDtoMapper {
    static toDto(
        notification: DonationRequestPostNotification,
    ): DonationRequestPostNotificationDto {
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

export { DonationRequestPostNotificationDtoMapper };