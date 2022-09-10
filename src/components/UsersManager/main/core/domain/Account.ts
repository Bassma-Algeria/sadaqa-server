import { Email } from './Email';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { AccountType } from './AccountType';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';
import { ProfilePicture } from './ProfilePicture';
import { NewProfilePicture, ProfilePictureUpdater } from './ProfilePictureUpdater';

import { AccountBuilder } from './AccountBuilder';

abstract class Account {
    protected abstract aBuilderFromThis(): AccountBuilder;

    protected constructor(
        protected accountId: AccountId,
        protected phoneNumber: PhoneNumber,
        protected wilayaNumber: WilayaNumber,
        protected email: Email,
        protected password: Password,
        protected accountType: AccountType,
        protected status: AccountStatus,
        protected profilePicture: ProfilePicture | null,
        protected createdAt: Date,
    ) {}

    getAccountId() {
        return this.accountId;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    getWilayaNumber() {
        return this.wilayaNumber;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getAccountType() {
        return this.accountType;
    }

    getAccountStatus() {
        return this.status;
    }

    getProfilePicture() {
        return this.profilePicture;
    }

    getCreationDate() {
        return this.createdAt;
    }

    activate() {
        this.status = AccountStatus.ACTIVE;
    }

    haveSamePhoneNumberAs(account: Account) {
        return this.phoneNumber.equals(account.phoneNumber);
    }

    haveSameEmailAs(account: Account) {
        return this.email.equals(account.email);
    }

    updateProfilePicture(newPicture: NewProfilePicture) {
        return {
            using: async (pictureUpdater: ProfilePictureUpdater) => {
                await pictureUpdater.update(this, newPicture);
            },
        };
    }

    removeProfilePicture() {
        this.profilePicture = null;
    }

    setProfilePicture(picture: ProfilePicture) {
        this.profilePicture = picture;
    }

    haveProfilePicture() {
        return this.profilePicture !== null;
    }

    canEditCredentials() {
        return this.status === AccountStatus.ACTIVE;
    }

    canEditGeneralInfo() {
        return this.status === AccountStatus.ACTIVE;
    }
}

export { Account };
