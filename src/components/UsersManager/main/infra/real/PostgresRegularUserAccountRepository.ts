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

interface AccountDBModel {
    accountId: string;
    firstName: string;
    lastName: string;
    wilayaNumber: number;
    phoneNumber: string;
    email: string;
    password: string;
    status: string;
    createdAt: Date;
}

class PostgresRegularUserAccountRepository implements RegularUserAccountRepository {
    async save(user: RegularUserAccount): Promise<void> {
        await prisma.regularUserAccount.create({ data: this.toDBModel(user) });
    }

    async update(account: RegularUserAccount): Promise<void> {
        await prisma.regularUserAccount.update({
            where: { accountId: account.accountId.value() },
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

    private toDBModel(user: RegularUserAccount): AccountDBModel {
        return {
            status: user.status,
            accountId: user.accountId.value(),
            firstName: user.firstName.value(),
            lastName: user.lastName.value(),
            email: user.email.value(),
            password: user.password.value(),
            phoneNumber: user.phoneNumber.value(),
            wilayaNumber: user.wilayaNumber.value(),
            createdAt: user.createdAt,
        };
    }

    private toDomainEntity(account: AccountDBModel): RegularUserAccount {
        return new RegularUserAccount(
            new AccountId(account.accountId),
            new FirstName(account.firstName),
            new LastName(account.lastName),
            new WilayaNumber(account.wilayaNumber),
            new PhoneNumber(account.phoneNumber),
            new Email(account.email),
            new Password(account.password),
            account.status as AccountStatus,
            account.createdAt,
        );
    }
}

export { PostgresRegularUserAccountRepository };
