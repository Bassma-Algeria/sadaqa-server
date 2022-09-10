import { OnlineUserRepository } from '../../core/domain/services/OnlineUserRepository';

import { AccountId } from '../../core/domain/AccountId';

class InMemoryOnlineUserRepository implements OnlineUserRepository {
    private readonly store = new Set<string>();

    async add(accountId: AccountId): Promise<void> {
        this.store.add(accountId.value());
    }

    async getAll(): Promise<AccountId[]> {
        return [...this.store].map(id => new AccountId(id));
    }

    async remove(accountId: AccountId): Promise<void> {
        this.store.delete(accountId.value());
    }
}

export { InMemoryOnlineUserRepository };
