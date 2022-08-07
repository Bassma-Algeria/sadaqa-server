import { AssociationName } from './AssociationName';
import { AssociationAccount } from './AssociationAccount';

import { AccountBuilder } from './AccountBuilder';

class AssociationAccountBuilder extends AccountBuilder {
    private associationName!: AssociationName;

    constructor(account?: AssociationAccount) {
        super(account);

        if (!account) return;

        this.associationName = account.associationName;
    }

    withName(name: AssociationName) {
        this.associationName = name;
        return this;
    }

    build() {
        return new AssociationAccount(
            this.accountId,
            this.associationName,
            this.phoneNumber,
            this.wilayaNumber,
            this.email,
            this.password,
            this.status,
            this.createdAt,
        );
    }
}

export { AssociationAccountBuilder };
