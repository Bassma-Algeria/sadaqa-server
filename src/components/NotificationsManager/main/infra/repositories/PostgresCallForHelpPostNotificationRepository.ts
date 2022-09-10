import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { PostNotificationReason } from '../../core/domain/PostNotificationReason';
import { CallForHelpPostNotification } from '../../core/domain/CallForHelpPostNotification';

import {
    CountFiltersNotificationRepository,
    FindManyFiltersNotificationRepository,
} from '../../core/domain/services/repositories/base/NotificationRepository';
import { CallForHelpPostNotificationRepository } from '../../core/domain/services/repositories/CallForHelpPostNotificationRepository';

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

class PostgresCallForHelpPostNotificationRepository
    implements CallForHelpPostNotificationRepository
{
    async save(notification: CallForHelpPostNotification): Promise<void> {
        await prisma.callForHelpPostNotification.create({ data: this.toDBModel(notification) });
    }

    async update(notification: CallForHelpPostNotification): Promise<void> {
        await prisma.callForHelpPostNotification.update({
            data: this.toDBModel(notification),
            where: { notificationId: notification.notificationId.value() },
        });
    }

    async findById(
        notificationId: NotificationId,
    ): Promise<CallForHelpPostNotification | undefined> {
        const notification = await prisma.callForHelpPostNotification.findUnique({
            where: { notificationId: notificationId.value() },
        });

        if (notification) return this.toEntity(notification);
        return undefined;
    }

    async findMany(
        filters: FindManyFiltersNotificationRepository,
    ): Promise<CallForHelpPostNotification[]> {
        const notifications = await prisma.callForHelpPostNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    async count(filters: CountFiltersNotificationRepository): Promise<number> {
        return await prisma.callForHelpPostNotification.count({
            where: {
                receiverId: filters.receiverId.value(),
                read: filters.read,
            },
        });
    }

    private toDBModel(entity: CallForHelpPostNotification): DBModel {
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
        return CallForHelpPostNotification.aBuilder()
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

export { PostgresCallForHelpPostNotificationRepository };
