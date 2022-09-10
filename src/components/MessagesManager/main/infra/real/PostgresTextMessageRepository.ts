import { UserId } from '../../core/domain/UserId';
import { MessageId } from '../../core/domain/MessageId';
import { TextMessage } from '../../core/domain/TextMessage';

import { TextMessageContent } from '../../core/domain/TextMessageContent';

import { TextMessageRepository } from '../../core/domain/services/MessageRepository/TextMessageRepository';
import { MessageRepositoryFindManyFilters } from '../../core/domain/services/MessageRepository/base/MessageRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    messageId: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
}

class PostgresTextMessageRepository implements TextMessageRepository {
    async save(message: TextMessage): Promise<void> {
        await prisma.textMessage.create({ data: this.toDBModel(message) });
    }

    async update(message: TextMessage): Promise<void> {
        await prisma.textMessage.update({
            where: { messageId: message.messageId.value() },
            data: this.toDBModel(message),
        });
    }

    async findMany(filters: MessageRepositoryFindManyFilters): Promise<TextMessage[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;
        const messages = await prisma.textMessage.findMany({
            orderBy: { createdAt: 'desc' },
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
            where: {
                OR: [
                    { receiverId: filters.and.value(), senderId: filters.between.value() },
                    { receiverId: filters.between.value(), senderId: filters.and.value() },
                ],
            },
        });

        return messages.map(this.toEntity);
    }

    async findLatestMessagesWithEveryUser(userId: UserId): Promise<TextMessage[]> {
        const messages = await prisma.$queryRaw<DBModel[]>`
           SELECT * FROM (
               SELECT
                   *,
                   row_number() OVER (
                       PARTITION BY LEAST("senderId", "receiverId"), GREATEST("senderId", "receiverId")
                       ORDER BY "createdAt" DESC
                   ) AS rn
               FROM "TextMessage"
               WHERE ${userId.value()} IN ("senderId", "receiverId")
           ) AS t
           WHERE rn = 1 ORDER BY "createdAt" DESC
       `;

        return messages.map(this.toEntity);
    }

    async countAllInConversation(filters: { between: UserId; and: UserId }): Promise<number> {
        return await prisma.textMessage.count({
            where: {
                OR: [
                    { receiverId: filters.and.value(), senderId: filters.between.value() },
                    { receiverId: filters.between.value(), senderId: filters.and.value() },
                ],
            },
        });
    }

    async countPerReceiver(filters: { receiverId: UserId; read?: boolean }) {
        return await prisma.textMessage.count({
            where: {
                receiverId: filters.receiverId.value(),
                read: filters.read,
            },
        });
    }

    async findById(id: MessageId): Promise<TextMessage | undefined> {
        const message = await prisma.textMessage.findUnique({ where: { messageId: id.value() } });

        if (!message) return undefined;
        else return this.toEntity(message);
    }

    private toEntity(model: DBModel): TextMessage {
        return TextMessage.aBuilder()
            .withMessageId(new MessageId(model.messageId))
            .withContent(new TextMessageContent(model.content))
            .withSenderId(new UserId(model.senderId))
            .withReceiverId(new UserId(model.receiverId))
            .withReadStatus(model.read)
            .withCreatedAt(model.createdAt)
            .build();
    }

    private toDBModel(message: TextMessage): DBModel {
        return {
            messageId: message.messageId.value(),
            senderId: message.senderId.value(),
            receiverId: message.receiverId.value(),
            content: message.content.value(),
            read: message.read,
            createdAt: message.createdAt,
        };
    }
}

export { PostgresTextMessageRepository };
