import { NotificationDto } from './base/NotificationDto';

export interface TextMessageNotificationDto extends NotificationDto {
    notification: NotificationDto['notification'] & {
        messageContent: string;
        messageSenderId: string;
    };
}
