import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { PostNotificationReason } from '../../core/domain/PostNotificationReason';
import { DonationRequestPostNotification } from '../../core/domain/DonationRequestPostNotification';

import {
    CountFiltersNotificationRepository,
    FindManyFiltersNotificationRepository,
} from '../../core/domain/services/repositories/base/NotificationRepository';
import { DonationRequestPostNotificationRepository } from '../../core/domain/services/repositories/DonationRequestPostNotificationRepository';

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

    async update(notification: DonationRequestPostNotification): Promise<void> {
        await prisma.donationRequestPostNotification.update({
            data: this.toDBModel(notification),
            where: { notificationId: notification.notificationId.value() },
        });
    }

    async findById(
        notificationId: NotificationId,
    ): Promise<DonationRequestPostNotification | undefined> {
        const notification = await prisma.donationRequestPostNotification.findUnique({
            where: { notificationId: notificationId.value() },
        });

        if (notification) return this.toEntity(notification);
        return undefined;
    }

    async findMany(
        filters: FindManyFiltersNotificationRepository,
    ): Promise<DonationRequestPostNotification[]> {
        const notifications = await prisma.donationRequestPostNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    async count(filters: CountFiltersNotificationRepository): Promise<number> {
        return await prisma.donationRequestPostNotification.count({
            where: {
                receiverId: filters.receiverId.value(),
                read: filters.read,
            },
        });
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
