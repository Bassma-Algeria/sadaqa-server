import { DonationPostNotification } from '../../DonationPostNotification';
import { UserId } from '../../UserId';

export interface FindManyDonationPostNotificationRepository {
    receiverId: UserId;
}

export interface DonationPostNotificationRepository {
    save(notification: DonationPostNotification): Promise<void>;

    findMany(
        filters: FindManyDonationPostNotificationRepository,
    ): Promise<DonationPostNotification[]>;
}
