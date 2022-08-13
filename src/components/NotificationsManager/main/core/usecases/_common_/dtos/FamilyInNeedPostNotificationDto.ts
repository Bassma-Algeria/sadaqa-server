import { NotificationDto } from './base/NotificationDto';

export interface FamilyInNeedPostNotificationDto extends NotificationDto {
    notification: NotificationDto['notification'] & {
        postId: string;
        reason: string;
    };
}