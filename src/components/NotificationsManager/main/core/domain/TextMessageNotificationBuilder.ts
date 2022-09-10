import { UserId } from './UserId';
import { NotificationBuilder } from './NotificationBuilder';
import { TextMessageNotification } from './TextMessageNotification';

class TextMessageNotificationBuilder extends NotificationBuilder {
    private messageSenderId!: UserId;
    private messageContent!: string;

    constructor(notification?: TextMessageNotification) {
        super(notification);

        if (!notification) return;

        this.messageContent = notification.messageContent;
        this.messageSenderId = notification.messageSenderId;
    }

    withMessageSenderId(id: UserId) {
        this.messageSenderId = id;
        return this;
    }

    withMessageContent(content: string) {
        this.messageContent = content;
        return this;
    }

    build() {
        return new TextMessageNotification(
            this.notificationId,
            this.receiverId,
            this.messageSenderId,
            this.messageContent,
            this.clicked,
            this.read,
            this.createdAt,
        );
    }
}

export { TextMessageNotificationBuilder };
