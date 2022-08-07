import { RegularUserAccount } from './RegularUserAccount';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { AccountBuilder } from './AccountBuilder';

class RegularUserAccountBuilder extends AccountBuilder {
    private firstName!: FirstName;
    private lastName!: LastName;

    constructor(account?: RegularUserAccount) {
        super(account);

        if (!account) return;

        this.firstName = account.firstName;
        this.lastName = account.lastName;
    }

    withFirstName(firstName: FirstName) {
        this.firstName = firstName;
        return this;
    }

    withLastName(lastName: LastName) {
        this.lastName = lastName;
        return this;
    }

    build(): RegularUserAccount {
        return new RegularUserAccount(
            this.accountId,
            this.firstName,
            this.lastName,
            this.wilayaNumber,
            this.phoneNumber,
            this.email,
            this.password,
            this.status,
            this.createdAt,
        );
    }
}

export { RegularUserAccountBuilder };
