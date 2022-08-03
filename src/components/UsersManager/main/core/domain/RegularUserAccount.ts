import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { RegularUserAccountBuilder } from './RegularUserAccountBuilder';

class RegularUserAccount {
    constructor(
        readonly userId: UserId,
        readonly firstName: FirstName,
        readonly lastName: LastName,
        readonly wilayaNumber: WilayaNumber,
        readonly phone: PhoneNumber,
        readonly email: Email,
        readonly password: Password,
        readonly createdAt: Date,
    ) {}

    static builder(user?: RegularUserAccount): RegularUserAccountBuilder {
        return new RegularUserAccountBuilder(user);
    }
}

export { RegularUserAccount };
