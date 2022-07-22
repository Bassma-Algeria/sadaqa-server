import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { AssociationAccountRepository } from '../../core/domain/services/AssociationAccountRepository';

class InMemoryAssociationAccountRepository implements AssociationAccountRepository {
  private readonly store: Map<string, AssociationAccount> = new Map<string, AssociationAccount>();

  async save(account: AssociationAccount): Promise<void> {
    this.store.set(account.associationId.value(), account);
  }

  async update(account: AssociationAccount): Promise<void> {
    this.store.set(account.associationId.value(), account);
  }

  async findById(associationId: UserId): Promise<AssociationAccount | undefined> {
    return this.store.get(associationId.value());
  }

  async findByEmail(email: Email): Promise<AssociationAccount | undefined> {
    let target: AssociationAccount | undefined;

    for (const account of this.store.values()) {
      if (account.email.value() === email.value()) target = account;
    }

    return target;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<AssociationAccount | undefined> {
    let target: AssociationAccount | undefined;

    for (const account of this.store.values()) {
      if (account.phone.value() === phone.value()) target = account;
    }

    return target;
  }
}

export { InMemoryAssociationAccountRepository };