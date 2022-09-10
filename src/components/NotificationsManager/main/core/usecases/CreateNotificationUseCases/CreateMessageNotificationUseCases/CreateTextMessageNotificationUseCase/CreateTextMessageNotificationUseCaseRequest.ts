export interface CreateTextMessageNotificationUseCaseRequest {
    content: string;
    senderId: string;
    messageId: string;
    receiverId: string;
}
