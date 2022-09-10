import { Email } from './Email';
import { Account } from './Account';
import { Password } from './Password';
import { LastName } from './LastName';
import { AccountId } from './AccountId';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { AccountType } from './AccountType';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';
import { ProfilePicture } from './ProfilePicture';

import { RegularUserAccountBuilder } from './RegularUserAccountBuilder';

class RegularUserAccount extends Account {
    constructor(
        protected accountId: AccountId,
        protected firstName: FirstName,
        protected lastName: LastName,
        protected wilayaNumber: WilayaNumber,
        protected phoneNumber: PhoneNumber,
        protected email: Email,
        protected password: Password,
        protected status: AccountStatus,
        protected profilePicture: ProfilePicture | null,
        protected createdAt: Date,
    ) {
        super(
            accountId,
            phoneNumber,
            wilayaNumber,
            email,
            password,
            AccountType.REGULAR_USER,
            status,
            profilePicture,
            createdAt,
        );
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    static aBuilder() {
        return new RegularUserAccountBuilder();
    }

    static aBuilderFrom(account: RegularUserAccount) {
        return new RegularUserAccountBuilder(account);
    }

    protected aBuilderFromThis() {
        return RegularUserAccount.aBuilderFrom(this);
    }
}

export { RegularUserAccount };
