import { Email } from './Email';
import { Account } from './Account';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { AccountType } from './AccountType';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';
import { AssociationName } from './AssociationName';

import { AssociationAccountBuilder } from './AssociationAccountBuilder';

class AssociationAccount extends Account {
    constructor(
        readonly accountId: AccountId,
        readonly associationName: AssociationName,
        readonly phoneNumber: PhoneNumber,
        readonly wilayaNumber: WilayaNumber,
        readonly email: Email,
        readonly password: Password,
        readonly status: AccountStatus,
        readonly createdAt: Date,
    ) {
        super(
            accountId,
            phoneNumber,
            wilayaNumber,
            email,
            password,
            AccountType.ASSOCIATION,
            status,
            createdAt,
        );
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
