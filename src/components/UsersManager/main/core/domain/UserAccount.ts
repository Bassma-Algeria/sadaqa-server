import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { UserAccountBuilder } from './UserAccountBuilder';

class UserAccount {
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

  static builder(user?: UserAccount): UserAccountBuilder {
    return new UserAccountBuilder(user);
  }
}

export { UserAccount };
