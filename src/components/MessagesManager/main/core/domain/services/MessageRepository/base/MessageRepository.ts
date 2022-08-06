import { UserId } from '../../../UserId';
import { Message } from '../../../Message';
import { MessageId } from '../../../MessageId';

export interface MessageRepositoryFindManyFilters {
    between: UserId;
    and: UserId;
    page: number;
    pageLimit: number;
}

export interface MessageRepository<M extends Message> {
    save(message: M): Promise<void>;

    update(message: M): Promise<void>;

    findById(id: MessageId): Promise<M | undefined>;

    findMany(filters: MessageRepositoryFindManyFilters): Promise<M[]>;

    findLatestMessagesWithEveryUser(userId: UserId): Promise<M[]>;

    count(filters: { between: UserId; and: UserId }): Promise<number>;
}