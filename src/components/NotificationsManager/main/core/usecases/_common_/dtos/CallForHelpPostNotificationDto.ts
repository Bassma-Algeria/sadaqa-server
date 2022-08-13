import { NotificationDto } from './base/NotificationDto';

export interface CallForHelpPostNotificationDto extends NotificationDto {
    notification: NotificationDto['notification'] & {
        postId: string;
        reason: string;
    };
}