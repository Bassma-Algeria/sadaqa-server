import { Email } from './Email';
import { Account } from './Account';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';

abstract class AccountBuilder {
    abstract build(): Account;

    protected accountId!: AccountId;
    protected phoneNumber!: PhoneNumber;
    protected wilayaNumber!: WilayaNumber;
    protected email!: Email;
    protected password!: Password;
    protected status!: AccountStatus;
    protected createdAt!: Date;

    protected constructor(account?: Account) {
        if (!account) return;

        this.accountId = account.accountId;
        this.wilayaNumber = account.wilayaNumber;
        this.phoneNumber = account.phoneNumber;
        this.email = account.email;
        this.password = account.password;
        this.status = account.status;
        this.createdAt = account.createdAt;
    }

    withAccountId(id: AccountId) {
        this.accountId = id;
        return this;
    }

    withWilayaNumber(number: WilayaNumber) {
        this.wilayaNumber = number;
        return this;
    }

    withPhone(phoneNumber: PhoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    withEmail(email: Email) {
        this.email = email;
        return this;
    }

    withPassword(password: Password) {
        this.password = password;
        return this;
    }

    withStatus(status: AccountStatus) {
        this.status = status;
        return this;
    }

    withCreatedAt(creationTime: Date) {
        this.createdAt = creationTime;
        return this;
    }
}

export { AccountBuilder };
