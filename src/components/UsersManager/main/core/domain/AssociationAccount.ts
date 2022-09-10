import { Email } from './Email';
import { Account } from './Account';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { AccountType } from './AccountType';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';
import { ProfilePicture } from './ProfilePicture';
import { AssociationName } from './AssociationName';

import { AssociationAccountBuilder } from './AssociationAccountBuilder';

class AssociationAccount extends Account {
    constructor(
        protected accountId: AccountId,
        protected associationName: AssociationName,
        protected phoneNumber: PhoneNumber,
        protected wilayaNumber: WilayaNumber,
        protected email: Email,
        protected password: Password,
        protected profilePicture: ProfilePicture | null,
        protected status: AccountStatus,
        protected createdAt: Date,
    ) {
        super(
            accountId,
            phoneNumber,
            wilayaNumber,
            email,
            password,
            AccountType.ASSOCIATION,
            status,
            profilePicture,
            createdAt,
        );
    }

    getAssociationName() {
        return this.associationName;
    }

    static aBuilder() {
        return new AssociationAccountBuilder();
    }

    static aBuilderFrom(account: AssociationAccount) {
        return new AssociationAccountBuilder(account);
    }

    protected aBuilderFromThis() {
        return AssociationAccount.aBuilderFrom(this);
    }
}

export { AssociationAccount };
