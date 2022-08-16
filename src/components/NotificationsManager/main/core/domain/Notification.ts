import { UserId } from './UserId';
import { NotificationId } from './NotificationId';
import { NotificationType } from './NotificationType';
import { NotificationBuilder } from './NotificationBuilder';

abstract class Notification {
    protected abstract aBuilderFromThis(): NotificationBuilder;

    protected constructor(
        readonly notificationId: NotificationId,
        readonly receiverId: UserId,
        readonly type: NotificationType,
        readonly clicked: boolean,
        readonly read: boolean,
        readonly createdAt: Date,
    ) {}

    makeRead() {
        return this.aBuilderFromThis().withRead(true).build();
    }

    makeClicked() {
        return this.aBuilderFromThis().withClicked(true).build();
    }
}

export { Notification };
