import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { AssociationName } from './AssociationName';
import { AssociationAccountBuilder } from './AssociationAccountBuilder';

class AssociationAccount {
    constructor(
        readonly associationId: UserId,
        readonly associationName: AssociationName,
        readonly phone: PhoneNumber,
        readonly wilayaNumber: WilayaNumber,
        readonly email: Email,
        readonly password: Password,
        readonly active: boolean,
        readonly createdAt: Date,
    ) {}

    public activate(): AssociationAccount {
        return AssociationAccount.aBuilder(this).withActiveStatus(true).build();
    }

    static aBuilder(from?: AssociationAccount) {
        return new AssociationAccountBuilder(from);
    }
}

export { AssociationAccount };
