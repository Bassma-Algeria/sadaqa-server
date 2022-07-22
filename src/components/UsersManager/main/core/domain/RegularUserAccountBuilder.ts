import { RegularUserAccount } from './RegularUserAccount';
import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { LastName } from './LastName';
import { FirstName } from './FirstName';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';

class RegularUserAccountBuilder {
  private _userId!: UserId;
  private _firstName!: FirstName;
  private _lastName!: LastName;
  private _wilayaNumber!: WilayaNumber;
  private _phone!: PhoneNumber;
  private _email!: Email;
  private _password!: Password;
  private _createdAt!: Date;

  constructor(account?: RegularUserAccount) {
    if (!account) return;

    this._userId = account.userId;
    this._firstName = account.firstName;
    this._lastName = account.lastName;
    this._wilayaNumber = account.wilayaNumber;
    this._phone = account.phone;
    this._email = account.email;
    this._password = account.password;
    this._createdAt = account.createdAt;
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

  createdAt(createdAt: Date) {
    this._createdAt = createdAt;
    return this;
  }

  build(): RegularUserAccount {
    return new RegularUserAccount(
      this._userId,
      this._firstName,
      this._lastName,
      this._wilayaNumber,
      this._phone,
      this._email,
      this._password,
      this._createdAt,
    );
  }
}

export { RegularUserAccountBuilder };
