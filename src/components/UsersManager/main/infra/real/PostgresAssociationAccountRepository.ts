import { AssociationAccountRepository } from '../../core/domain/services/AccountRepository/AssociationAccountRepository';

import { Email } from '../../core/domain/Email';
import { Password } from '../../core/domain/Password';
import { AccountId } from '../../core/domain/AccountId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { AccountStatus } from '../../core/domain/AccountStatus';
import { AssociationName } from '../../core/domain/AssociationName';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    accountId: string;
    associationName: string;
    wilayaNumber: number;
    phoneNumber: string;
    email: string;
    password: string;
    status: string;
    createdAt: Date;
}

class PostgresAssociationAccountRepository implements AssociationAccountRepository {
    async save(account: AssociationAccount): Promise<void> {
        await prisma.associationAccount.create({ data: this.toDBModel(account) });
    }

    async update(account: AssociationAccount): Promise<void> {
        await prisma.associationAccount.update({
            data: this.toDBModel(account),
            where: { accountId: account.accountId.value() },
        });
    }

    async findById(accountId: AccountId): Promise<AssociationAccount | undefined> {
        const account = await prisma.associationAccount.findUnique({
            where: { accountId: accountId.value() },
        });

        if (!account) return undefined;
        return this.toEntity(account);
    }

    async findByEmail(email: Email): Promise<AssociationAccount | undefined> {
        const account = await prisma.associationAccount.findUnique({
            where: { email: email.value() },
        });

        if (!account) return undefined;
        return this.toEntity(account);
    }

    async findByPhoneNumber(phone: PhoneNumber): Promise<AssociationAccount | undefined> {
        const account = await prisma.associationAccount.findUnique({
            where: { phoneNumber: phone.value() },
        });

        if (!account) return undefined;
        return this.toEntity(account);
    }

    private toDBModel(account: AssociationAccount): DBModel {
        return {
            accountId: account.accountId.value(),
            associationName: account.associationName.value(),
            phoneNumber: account.phoneNumber.value(),
            email: account.email.value(),
            password: account.password.value(),
            wilayaNumber: account.wilayaNumber.value(),
            status: account.status,
            createdAt: account.createdAt,
        };
    }

    private toEntity(dbModel: DBModel): AssociationAccount {
        return new AssociationAccount(
            new AccountId(dbModel.accountId),
            new AssociationName(dbModel.associationName),
            new PhoneNumber(dbModel.phoneNumber),
            new WilayaNumber(dbModel.wilayaNumber),
            new Email(dbModel.email),
            new Password(dbModel.password),
            dbModel.status as AccountStatus,
            dbModel.createdAt,
        );
    }
}

export { PostgresAssociationAccountRepository };
