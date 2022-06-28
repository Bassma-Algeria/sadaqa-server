import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { UserAccount } from '../../core/domain/UserAccount';
import { UserAccountRepository } from '../../core/domain/services/UserAccountRepository';

class InMemoryUserAccountRepository implements UserAccountRepository {
  private readonly store = new Map<UserId, UserAccount>();

  async add(account: UserAccount): Promise<void> {
    this.store.set(account.userId, account);
  }

  async findByEmail(email: Email): Promise<UserAccount | undefined> {
    let target: UserAccount | undefined;

    for (const userAccount of this.store.values()) {
      if (userAccount.email.value() === email.value()) target = userAccount;
    }

    return target;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<UserAccount | undefined> {
    let target: UserAccount | undefined;

    for (const userAccount of this.store.values()) {
      if (userAccount.phone.value() === phone.value()) target = userAccount;
    }

    return target;
  }
}

export { InMemoryUserAccountRepository };
