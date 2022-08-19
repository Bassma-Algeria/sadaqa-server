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

import { RegularUserAccountBuilder } from './RegularUserAccountBuilder';

class RegularUserAccount extends Account {
    constructor(
        readonly accountId: AccountId,
        readonly firstName: FirstName,
        readonly lastName: LastName,
        readonly wilayaNumber: WilayaNumber,
        readonly phoneNumber: PhoneNumber,
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
            AccountType.REGULAR_USER,
            status,
            createdAt,
        );
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
