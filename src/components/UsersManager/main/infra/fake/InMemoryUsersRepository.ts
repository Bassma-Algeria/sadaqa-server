import { User } from '../../core/domain/User';
import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { UsersRepository } from '../../core/domain/UsersRepository';
import { PhoneNumber } from '../../core/domain/PhoneNumber';

class InMemoryUsersRepository implements UsersRepository {
  private readonly store = new Map<UserId, User>();

  async add(user: User): Promise<void> {
    this.store.set(user.userId, user);
  }

  async findByEmail(email: Email): Promise<User | undefined> {
    let target: User | undefined;

    for (const user of this.store.values()) {
      if (user.email.value() === email.value()) target = user;
    }

    return target;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<User | undefined> {
    let target: User | undefined;

    for (const user of this.store.values()) {
      if (user.phone.value() === phone.value()) target = user;
    }

    return target;
  }
}

export { InMemoryUsersRepository };
