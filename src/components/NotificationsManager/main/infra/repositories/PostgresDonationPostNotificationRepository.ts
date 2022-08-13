import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { PostNotificationReason } from '../../core/domain/PostNotificationReason';
import { DonationPostNotification } from '../../core/domain/DonationPostNotification';

import { FindManyFiltersNotificationRepository } from '../../core/domain/services/repositories/base/NotificationRepository';
import { DonationPostNotificationRepository } from '../../core/domain/services/repositories/DonationPostNotificationRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    notificationId: string;
    receiverId: string;
    postId: string;
    reason: string;
    clicked: boolean;
    read: boolean;
    createdAt: Date;
}

class PostgresDonationPostNotificationRepository implements DonationPostNotificationRepository {
    async save(notification: DonationPostNotification): Promise<void> {
        await prisma.donationPostNotification.create({ data: this.toDBModel(notification) });
    }

    async findMany(
        filters: FindManyFiltersNotificationRepository,
    ): Promise<DonationPostNotification[]> {
        const notifications = await prisma.donationPostNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    private toDBModel(entity: DonationPostNotification): DBModel {
        return {
            notificationId: entity.notificationId.value(),
            postId: entity.postId.value(),
            receiverId: entity.receiverId.value(),
            reason: entity.reason,
            clicked: entity.clicked,
            read: entity.read,
            createdAt: entity.createdAt,
        };
    }

    private toEntity(model: DBModel) {
        return DonationPostNotification.aBuilder()
            .withId(new NotificationId(model.notificationId))
            .withReceiverId(new UserId(model.receiverId))
            .withPostId(new PostId(model.postId))
            .withReason(model.reason as PostNotificationReason)
            .withRead(model.read)
            .withClicked(model.clicked)
            .withCreatedAt(model.createdAt)
            .build();
    }
}

export { PostgresDonationPostNotificationRepository };