import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { PostNotificationReason } from '../../core/domain/PostNotificationReason';
import { DonationRequestPostNotification } from '../../core/domain/DonationRequestPostNotification';

import {
    DonationRequestPostNotificationRepository,
    FindManyDonationRequestPostNotificationRepository,
} from '../../core/domain/services/repositories/DonationRequestPostNotificationRepository';

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

class PostgresDonationRequestPostNotificationRepository
    implements DonationRequestPostNotificationRepository
{
    async save(notification: DonationRequestPostNotification): Promise<void> {
        await prisma.donationRequestPostNotification.create({ data: this.toDBModel(notification) });
    }

    async findMany(
        filters: FindManyDonationRequestPostNotificationRepository,
    ): Promise<DonationRequestPostNotification[]> {
        const notifications = await prisma.donationRequestPostNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    private toDBModel(entity: DonationRequestPostNotification): DBModel {
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
        return DonationRequestPostNotification.aBuilder()
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

export { PostgresDonationRequestPostNotificationRepository };