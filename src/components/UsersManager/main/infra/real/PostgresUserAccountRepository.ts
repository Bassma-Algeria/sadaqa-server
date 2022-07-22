import { RegularUserAccountRepository } from '../../core/domain/services/RegularUserAccountRepository';

import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { LastName } from '../../core/domain/LastName';
import { Password } from '../../core/domain/Password';
import { FirstName } from '../../core/domain/FirstName';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

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

class PostgresUserAccountRepository implements RegularUserAccountRepository {
  async save(user: RegularUserAccount): Promise<void> {
    await prisma.user.create({ data: this.toDBModel(user) });
  }

  async findByEmail(email: Email): Promise<RegularUserAccount | undefined> {
    const account = await prisma.user.findUnique({ where: { email: email.value() } });

    if (account) return this.toDomainEntity(account);
    else return undefined;
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<RegularUserAccount | undefined> {
    const account = await prisma.user.findUnique({ where: { phone: phone.value() } });

    if (account) return this.toDomainEntity(account);
    else return undefined;
  }

  async findById(userId: UserId): Promise<RegularUserAccount | undefined> {
    const account = await prisma.user.findUnique({ where: { userId: userId.value() } });

    if (account) return this.toDomainEntity(account);
    else return undefined;
  }

  private toDBModel(user: RegularUserAccount): AccountDBModel {
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

  private toDomainEntity(account: AccountDBModel): RegularUserAccount {
    return new RegularUserAccount(
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
