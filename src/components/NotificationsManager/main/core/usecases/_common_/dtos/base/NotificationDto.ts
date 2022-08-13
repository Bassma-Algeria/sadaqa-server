export interface NotificationDto {
    type: string;
    notification: {
        notificationId: string;
        receiverId: string;
        read: boolean;
        clicked: boolean;
        createdAt: Date;
    };
}