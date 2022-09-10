import { AssociationAccountRepository } from '../../core/domain/services/AccountRepository/AssociationAccountRepository';

import { Email } from '../../core/domain/Email';
import { Password } from '../../core/domain/Password';
import { AccountId } from '../../core/domain/AccountId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { AccountStatus } from '../../core/domain/AccountStatus';
import { ProfilePicture } from '../../core/domain/ProfilePicture';
import { AssociationName } from '../../core/domain/AssociationName';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { AccountRepositoryFindManyFilters } from '../../core/domain/services/AccountRepository/base/AccountRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    accountId: string;
    associationName: string;
    wilayaNumber: number;
    phoneNumber: string;
    email: string;
    password: string;
    status: string;
    profilePicture: string | null;
    createdAt: Date;
}

class PostgresAssociationAccountRepository implements AssociationAccountRepository {
    async save(account: AssociationAccount): Promise<void> {
        await prisma.associationAccount.create({ data: this.toDBModel(account) });
    }

    async update(account: AssociationAccount): Promise<void> {
        await prisma.associationAccount.update({
            data: this.toDBModel(account),
            where: { accountId: account.getAccountId().value() },
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

    async findMany(filters: AccountRepositoryFindManyFilters): Promise<AssociationAccount[]> {
        const accounts = await prisma.associationAccount.findMany({
            where: {
                status: filters.accountStatus,
                wilayaNumber: filters.wilayaNumber.value(),
            },
        });

        return accounts.map(this.toEntity);
    }

    async deleteAll() {
        await prisma.associationAccount.deleteMany();
    }

    private toDBModel(account: AssociationAccount): DBModel {
        return {
            accountId: account.getAccountId().value(),
            phoneNumber: account.getPhoneNumber().value(),
            wilayaNumber: account.getWilayaNumber().value(),
            associationName: account.getAssociationName().value(),
            profilePicture: account.getProfilePicture() ? account.getProfilePicture()!.url() : null,
            status: account.getAccountStatus(),
            email: account.getEmail().value(),
            password: account.getPassword().value(),
            createdAt: account.getCreationDate(),
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
            dbModel.profilePicture ? new ProfilePicture(dbModel.profilePicture) : null,
            dbModel.status as AccountStatus,
            dbModel.createdAt,
        );
    }
}

export { PostgresAssociationAccountRepository };
