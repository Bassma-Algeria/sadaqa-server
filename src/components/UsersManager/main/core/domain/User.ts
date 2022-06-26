import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { UserBuilder } from './UserBuilder';
import { FirstName } from './FirstName';
import { LastName } from './LastName';

class User {
  constructor(
    readonly userId: UserId,
    readonly firstName: FirstName,
    readonly lastName: LastName,
    readonly wilayaNumber: WilayaNumber,
    readonly phone: PhoneNumber,
    readonly email: Email,
    readonly password: Password,
  ) {}

  static builder(user?: User): UserBuilder {
    return new UserBuilder(user);
  }
}

export { User };
