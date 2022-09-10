import { RegularUserAccountRepository } from '../../core/domain/services/AccountRepository/RegularUserAccountRepository';

import { Email } from '../../core/domain/Email';
import { LastName } from '../../core/domain/LastName';
import { Password } from '../../core/domain/Password';
import { FirstName } from '../../core/domain/FirstName';
import { AccountId } from '../../core/domain/AccountId';
import { PhoneNumber } from '../../core/domain/PhoneNumber';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { AccountStatus } from '../../core/domain/AccountStatus';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';
import { AccountRepositoryFindManyFilters } from '../../core/domain/services/AccountRepository/base/AccountRepository';
import { ProfilePicture } from '../../core/domain/ProfilePicture';

interface AccountDBModel {
    accountId: string;
    firstName: string;
    lastName: string;
    wilayaNumber: number;
    phoneNumber: string;
    email: string;
    password: string;
    profilePicture: string | null;
    status: string;
    createdAt: Date;
}

class PostgresRegularUserAccountRepository implements RegularUserAccountRepository {
    async save(user: RegularUserAccount): Promise<void> {
        await prisma.regularUserAccount.create({ data: this.toDBModel(user) });
    }

    async update(account: RegularUserAccount): Promise<void> {
        await prisma.regularUserAccount.update({
            where: { accountId: account.getAccountId().value() },
            data: this.toDBModel(account),
        });
    }

    async findByEmail(email: Email): Promise<RegularUserAccount | undefined> {
        const account = await prisma.regularUserAccount.findUnique({
            where: { email: email.value() },
        });

        if (account) return this.toDomainEntity(account);
        else return undefined;
    }

    async findByPhoneNumber(phone: PhoneNumber): Promise<RegularUserAccount | undefined> {
        const account = await prisma.regularUserAccount.findUnique({
            where: { phoneNumber: phone.value() },
        });

        if (account) return this.toDomainEntity(account);
        else return undefined;
    }

    async findById(accountId: AccountId): Promise<RegularUserAccount | undefined> {
        const account = await prisma.regularUserAccount.findUnique({
            where: { accountId: accountId.value() },
        });

        if (account) return this.toDomainEntity(account);
        else return undefined;
    }

    async findMany(filters: AccountRepositoryFindManyFilters): Promise<RegularUserAccount[]> {
        const accounts = await prisma.regularUserAccount.findMany({
            where: {
                status: filters.accountStatus,
                wilayaNumber: filters.wilayaNumber.value(),
            },
        });

        return accounts.map(this.toDomainEntity);
    }

    async deleteAll() {
        await prisma.regularUserAccount.deleteMany();
    }

    private toDBModel(account: RegularUserAccount): AccountDBModel {
        return {
            accountId: account.getAccountId().value(),
            phoneNumber: account.getPhoneNumber().value(),
            wilayaNumber: account.getWilayaNumber().value(),
            firstName: account.getFirstName().value(),
            lastName: account.getLastName().value(),
            profilePicture: account.getProfilePicture() ? account.getProfilePicture()!.url() : null,
            status: account.getAccountStatus(),
            email: account.getEmail().value(),
            password: account.getPassword().value(),
            createdAt: account.getCreationDate(),
        };
    }

    private toDomainEntity(dbModel: AccountDBModel): RegularUserAccount {
        return new RegularUserAccount(
            new AccountId(dbModel.accountId),
            new FirstName(dbModel.firstName),
            new LastName(dbModel.lastName),
            new WilayaNumber(dbModel.wilayaNumber),
            new PhoneNumber(dbModel.phoneNumber),
            new Email(dbModel.email),
            new Password(dbModel.password),
            dbModel.status as AccountStatus,
            dbModel.profilePicture ? new ProfilePicture(dbModel.profilePicture) : null,
            dbModel.createdAt,
        );
    }
}

export { PostgresRegularUserAccountRepository };
