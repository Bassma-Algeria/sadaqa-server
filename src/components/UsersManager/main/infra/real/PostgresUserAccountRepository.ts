import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { LastName } from '../../core/domain/LastName';
import { Password } from '../../core/domain/Password';
import { FirstName } from '../../core/domain/FirstName';
import { UserAccount } from '../../core/domain/UserAccount';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';

import { UserAccountRepository } from '../../core/domain/services/UserAccountRepository';

interface AccountDBModel {
  userId: string;
  firstName: string;
  lastName: string;
  wilayaNumber: number;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
}

class PostgresUserAccountRepository implements UserAccountRepository {
  async add(user: UserAccount): Promise<void> {
    await prisma.user.create({ data: this.toDBModel(user) });
  }

  async findByEmail(email: Email): Promise<UserAccount | undefined> {
    const account = await prisma.user.findUnique({ where: { email: email.value() } });

    if (account) return this.toDomainEntity(account);
    else return undefined;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<UserAccount | undefined> {
    const account = await prisma.user.findUnique({ where: { phone: phone.value() } });

    if (account) return this.toDomainEntity(account);
    else return undefined;
  }

  private toDBModel(user: UserAccount): AccountDBModel {
    return {
      userId: user.userId.value(),
      firstName: user.firstName.value(),
      lastName: user.lastName.value(),
      email: user.email.value(),
      password: user.password.value(),
      phone: user.phone.value(),
      wilayaNumber: user.wilayaNumber.value(),
      createdAt: user.createdAt,
    };
  }

  private toDomainEntity(account: AccountDBModel): UserAccount {
    return new UserAccount(
      new UserId(account.userId),
      new FirstName(account.firstName),
      new LastName(account.lastName),
      new WilayaNumber(account.wilayaNumber),
      new PhoneNumber(account.phone),
      new Email(account.email),
      new Password(account.password),
      account.createdAt,
    );
  }
}

export { PostgresUserAccountRepository };
