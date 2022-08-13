import { UserId } from '../../UserId';
import { DonationRequestPostNotification } from '../../DonationRequestPostNotification';

export interface FindManyFamilyInNeedPostNotificationRepository {
    receiverId: UserId;
}

export interface FamilyInNeedPostNotificationRepository {
    save(notification: DonationRequestPostNotification): Promise<void>;

    findMany(
        filters: FindManyFamilyInNeedPostNotificationRepository,
    ): Promise<DonationRequestPostNotification[]>;
}
