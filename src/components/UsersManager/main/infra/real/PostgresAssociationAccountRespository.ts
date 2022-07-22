import { AssociationAccountRepository } from '../../core/domain/services/AssociationAccountRepository';

import { Email } from '../../core/domain/Email';
import { UserId } from '../../core/domain/UserId';
import { Password } from '../../core/domain/Password';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { AssociationName } from '../../core/domain/AssociationName';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
  associationId: string;
  associationName: string;
  wilayaNumber: number;
  phone: string;
  email: string;
  password: string;
  active: boolean;
  createdAt: Date;
}

class PostgresAssociationAccountRespository implements AssociationAccountRepository {
  async save(account: AssociationAccount): Promise<void> {
    await prisma.association.create({ data: this.toDBModel(account) });
  }

  async update(account: AssociationAccount): Promise<void> {
    await prisma.association.update({
      data: this.toDBModel(account),
      where: { associationId: account.associationId.value() },
    });
  }

  async findById(associationId: UserId): Promise<AssociationAccount | undefined> {
    const account = await prisma.association.findUnique({
      where: { associationId: associationId.value() },
    });

    if (!account) return undefined;
    return this.toEntity(account);
  }

  async findByEmail(email: Email): Promise<AssociationAccount | undefined> {
    const account = await prisma.association.findUnique({ where: { email: email.value() } });

    if (!account) return undefined;
    return this.toEntity(account);
  }

  async findByPhoneNumber(phone: PhoneNumber): Promise<AssociationAccount | undefined> {
    const account = await prisma.association.findUnique({ where: { phone: phone.value() } });

    if (!account) return undefined;
    return this.toEntity(account);
  }

  private toDBModel(account: AssociationAccount): DBModel {
    return {
      associationId: account.associationId.value(),
      associationName: account.associationName.value(),
      phone: account.phone.value(),
      email: account.email.value(),
      password: account.password.value(),
      wilayaNumber: account.wilayaNumber.value(),
      active: account.active,
      createdAt: account.createdAt,
    };
  }

  private toEntity(dbModel: DBModel): AssociationAccount {
    return new AssociationAccount(
      new UserId(dbModel.associationId),
      new AssociationName(dbModel.associationName),
      new PhoneNumber(dbModel.phone),
      new WilayaNumber(dbModel.wilayaNumber),
      new Email(dbModel.email),
      new Password(dbModel.password),
      dbModel.active,
      dbModel.createdAt,
    );
  }
}

export { PostgresAssociationAccountRespository };
