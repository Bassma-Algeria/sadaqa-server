import { NotificationDto } from './base/NotificationDto';

export interface DonationPostNotificationDto extends NotificationDto {
    notification: NotificationDto['notification'] & {
        postId: string;
        reason: string;
    };
}