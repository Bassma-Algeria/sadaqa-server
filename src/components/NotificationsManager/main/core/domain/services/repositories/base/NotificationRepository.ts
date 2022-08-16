import { UserId } from '../../../UserId';
import { Notification } from '../../../Notification';
import { NotificationId } from '../../../NotificationId';

export interface FindManyFiltersNotificationRepository {
    receiverId: UserId;
}

export interface CountFiltersNotificationRepository {
    receiverId: UserId;
    read?: boolean;
}

export interface NotificationRepository<N extends Notification> {
    save(notification: N): Promise<void>;

    update(notification: N): Promise<void>;

    findById(notificationId: NotificationId): Promise<N | undefined>;

    findMany(filters: FindManyFiltersNotificationRepository): Promise<N[]>;

    count(filters: CountFiltersNotificationRepository): Promise<number>;
}
