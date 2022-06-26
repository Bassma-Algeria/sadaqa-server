import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { UserBuilder } from './UserBuilder';
import { WilayaNumber } from './WilayaNumber';

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
