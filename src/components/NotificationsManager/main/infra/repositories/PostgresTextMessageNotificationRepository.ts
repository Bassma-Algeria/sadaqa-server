import { UserId } from '../../core/domain/UserId';
import { NotificationId } from '../../core/domain/NotificationId';
import { TextMessageNotification } from '../../core/domain/TextMessageNotification';

import { FindManyFiltersNotificationRepository } from '../../core/domain/services/repositories/base/NotificationRepository';
import { TextMessageNotificationRepository } from '../../core/domain/services/repositories/TextMessageNotificationRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    notificationId: string;
    receiverId: string;
    messageContent: string;
    messageSenderId: string;
    clicked: boolean;
    read: boolean;
    createdAt: Date;
}

class PostgresTextMessageNotificationRepository implements TextMessageNotificationRepository {
    async save(notification: TextMessageNotification): Promise<void> {
        await prisma.textMessageNotification.create({ data: this.toDBModel(notification) });
    }

    async findMany(
        filters: FindManyFiltersNotificationRepository,
    ): Promise<TextMessageNotification[]> {
        const notifications = await prisma.textMessageNotification.findMany({
            where: {
                receiverId: filters.receiverId.value(),
            },
        });

        return notifications.map(this.toEntity);
    }

    private toDBModel(entity: TextMessageNotification): DBModel {
        return {
            notificationId: entity.notificationId.value(),
            receiverId: entity.receiverId.value(),
            messageSenderId: entity.messageSenderId.value(),
            messageContent: entity.messageContent,
            clicked: entity.clicked,
            read: entity.read,
            createdAt: entity.createdAt,
        };
    }

    private toEntity(model: DBModel) {
        return TextMessageNotification.aBuilder()
            .withId(new NotificationId(model.notificationId))
            .withReceiverId(new UserId(model.receiverId))
            .withMessageContent(model.messageContent)
            .withMessageSenderId(new UserId(model.messageSenderId))
            .withRead(model.read)
            .withClicked(model.clicked)
            .withCreatedAt(model.createdAt)
            .build();
    }
}

export { PostgresTextMessageNotificationRepository };
