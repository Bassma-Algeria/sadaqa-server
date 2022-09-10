import { AccountId } from '../AccountId';

export interface OnlineUserRepository {
    add(accountId: AccountId): Promise<void>;

    remove(accountId: AccountId): Promise<void>;

    getAll(): Promise<AccountId[]>;
}