import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';
import { RegularUserAccountRepository } from '../../core/domain/services/RegularUserAccountRepository';

class InMemoryRegularUserAccountRepository implements RegularUserAccountRepository {
    private readonly store = new Map<string, RegularUserAccount>();

    async save(account: RegularUserAccount): Promise<void> {
        this.store.set(account.userId.value(), account);
    }

    async findByEmail(email: Email): Promise<RegularUserAccount | undefined> {
        let target: RegularUserAccount | undefined;

        for (const userAccount of this.store.values()) {
            if (userAccount.email.value() === email.value()) target = userAccount;
        }

        return target;
    }

    async findByPhoneNumber(phone: PhoneNumber): Promise<RegularUserAccount | undefined> {
        let target: RegularUserAccount | undefined;

        for (const userAccount of this.store.values()) {
            if (userAccount.phone.value() === phone.value()) target = userAccount;
        }

        return target;
    }

    async findById(userId: UserId): Promise<RegularUserAccount | undefined> {
        return this.store.get(userId.value());
    }
}

export { InMemoryRegularUserAccountRepository };
