import { UserId } from '../../UserId';
import { FamilyInNeedPostNotification } from '../../FamilyInNeedPostNotification';

export interface FindManyFamilyInNeedPostNotificationRepository {
    receiverId: UserId;
}

export interface FamilyInNeedPostNotificationRepository {
    save(notification: FamilyInNeedPostNotification): Promise<void>;

    findMany(
        filters: FindManyFamilyInNeedPostNotificationRepository,
    ): Promise<FamilyInNeedPostNotification[]>;
}
