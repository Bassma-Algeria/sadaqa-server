import { UserId } from '../../../UserId';
import { Notification } from '../../../Notification';

export interface FindManyFiltersNotificationRepository {
    receiverId: UserId;
}

export interface NotificationRepository<N extends Notification> {
    save(notification: N): Promise<void>;

    findMany(filters: FindManyFiltersNotificationRepository): Promise<N[]>;
}