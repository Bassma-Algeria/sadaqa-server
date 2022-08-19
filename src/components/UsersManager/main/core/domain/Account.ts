import { Email } from './Email';
import { Password } from './Password';
import { AccountId } from './AccountId';
import { PhoneNumber } from './PhoneNumber';
import { AccountType } from './AccountType';
import { WilayaNumber } from './WilayaNumber';
import { AccountStatus } from './AccountStatus';

import { AccountBuilder } from './AccountBuilder';

abstract class Account {
    protected abstract aBuilderFromThis(): AccountBuilder;

    protected constructor(
        readonly accountId: AccountId,
        readonly phoneNumber: PhoneNumber,
        readonly wilayaNumber: WilayaNumber,
        readonly email: Email,
        readonly password: Password,
        readonly accountType: AccountType,
        readonly status: AccountStatus,
        readonly createdAt: Date,
    ) {}

    enable() {
        return this.aBuilderFromThis().withStatus(AccountStatus.ENABLED).build();
    }
}

export { Account };
