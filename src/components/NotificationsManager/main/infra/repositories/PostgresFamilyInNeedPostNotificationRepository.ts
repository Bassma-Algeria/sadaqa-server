import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { PostNotificationReason } from '../../core/domain/PostNotificationReason';
import { FamilyInNeedPostNotification } from '../../core/domain/FamilyInNeedPostNotification';

import {
    CountFiltersNotificationRepository,
    FindManyFiltersNotificationRepository,
} from '../../core/domain/services/repositories/base/NotificationRepository';
import { FamilyInNeedPostNotificationRepository } from '../../core/domain/services/repositories/FamilyInNeedPostNotificationRepository';

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

class PostgresFamilyInNeedPostNotificationRepository
    implements FamilyInNeedPostNotificationRepository
{
    async save(notification: FamilyInNeedPostNotification): Promise<void> {
        await prisma.familyInNeedPostNotification.create({ data: this.toDBModel(notification) });
    }

    async update(notification: FamilyInNeedPostNotification): Promise<void> {
        await prisma.familyInNeedPostNotification.update({
            data: this.toDBModel(notification),
            where: { notificationId: notification.notificationId.value() },
        });
    }

    async findById(
        notificationId: NotificationId,
    ): Promise<FamilyInNeedPostNotification | undefined> {
        const notification = await prisma.familyInNeedPostNotification.findUnique({
            where: { notificationId: notificationId.value() },
        });

        if (notification) return this.toEntity(notification);
        return undefined;
    }

    async findMany(
        filters: FindManyFiltersNotificationRepository,
    ): Promise<FamilyInNeedPostNotification[]> {
        const notifications = await prisma.familyInNeedPostNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    async count(filters: CountFiltersNotificationRepository): Promise<number> {
        return await prisma.familyInNeedPostNotification.count({
            where: {
                receiverId: filters.receiverId.value(),
                read: filters.read,
            },
        });
    }

    private toDBModel(entity: FamilyInNeedPostNotification): DBModel {
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
        return FamilyInNeedPostNotification.aBuilder()
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

export { PostgresFamilyInNeedPostNotificationRepository };
