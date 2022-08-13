export interface FamilyInNeedPostNotificationDto {
    type: string;
    notification: {
        notificationId: string;
        postId: string;
        receiverId: string;
        reason: string;
        read: boolean;
        clicked: boolean;
        createdAt: Date;
    };
}