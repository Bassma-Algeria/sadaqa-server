import { User } from './User';
import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';

class UserBuilder {
  private _userId!: UserId;
  private _firstName!: FirstName;
  private _lastName!: LastName;
  private _wilayaNumber!: WilayaNumber;
  private _phone!: PhoneNumber;
  private _email!: Email;
  private _password!: Password;

  constructor(user?: User) {
    if (!user) return;

    this._userId = user.userId;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this._wilayaNumber = user.wilayaNumber;
    this._phone = user.phone;
    this._email = user.email;
    this._password = user.password;
  }

  userId(userId: UserId) {
    this._userId = userId;
    return this;
  }

  firstName(firstName: FirstName) {
    this._firstName = firstName;
    return this;
  }

  lastName(lastName: LastName) {
    this._lastName = lastName;
    return this;
  }

  wilayaNumber(wilayaNumber: WilayaNumber) {
    this._wilayaNumber = wilayaNumber;
    return this;
  }

  phoneNumber(phone: PhoneNumber) {
    this._phone = phone;
    return this;
  }

  email(email: Email) {
    this._email = email;
    return this;
  }

  password(password: Password) {
    this._password = password;
    return this;
  }

  build(): User {
    return new User(
      this._userId,
      this._firstName,
      this._lastName,
      this._wilayaNumber,
      this._phone,
      this._email,
      this._password,
    );
  }
}

export { UserBuilder };
