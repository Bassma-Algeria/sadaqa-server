import { Email } from './Email';
import { Account } from './Account';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';
import { ProfilePicture } from './ProfilePicture';

abstract class AccountBuilder {
    abstract build(): Account;

    protected accountId!: AccountId;
    protected phoneNumber!: PhoneNumber;
    protected wilayaNumber!: WilayaNumber;
    protected email!: Email;
    protected password!: Password;
    protected status!: AccountStatus;
    protected profilePicture!: ProfilePicture | null;
    protected createdAt!: Date;

    protected constructor(account?: Account) {
        if (!account) return;

        this.accountId = account.getAccountId();
        this.wilayaNumber = account.getWilayaNumber();
        this.phoneNumber = account.getPhoneNumber();
        this.email = account.getEmail();
        this.password = account.getPassword();
        this.status = account.getAccountStatus();
        this.profilePicture = account.getProfilePicture();
        this.createdAt = account.getCreationDate();
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

    withProfilePicture(picture: ProfilePicture | null) {
        this.profilePicture = picture;
        return this;
    }
}

export { AccountBuilder };
