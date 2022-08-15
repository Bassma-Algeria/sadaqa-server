import { TextMessageNotification } from '../../../domain/TextMessageNotification';

import { NotificationDtoMapper } from './base/NotificationDtoMapper';
import { TextMessageNotificationDto } from './TextMessageNotificationDto';

class TextMessageNotificationDtoMapper extends NotificationDtoMapper {
    static toDto(notification: TextMessageNotification): TextMessageNotificationDto {
        return {
            ...super.toDto(notification),
            notification: {
                ...super.toDto(notification).notification,

                messageSenderId: notification.messageSenderId.value(),
                messageContent: notification.messageContent,
            },
        };
    }
}

export { TextMessageNotificationDtoMapper };
