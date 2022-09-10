import { NotificationDto } from './base/NotificationDto';

export interface DonationRequestPostNotificationDto extends NotificationDto {
    notification: NotificationDto['notification'] & {
        postId: string;
        reason: string;
    };
}