import { Email } from './Email';
import { UserId } from './UserId';
import { Password } from './Password';
import { PhoneNumber } from './PhoneNumber';
import { WilayaNumber } from './WilayaNumber';
import { AssociationName } from './AssociationName';
import { AssociationAccount } from './AssociationAccount';

class AssociationAccountBuilder {
    private _associationId!: UserId;
    private _associationName!: AssociationName;
    private _phone!: PhoneNumber;
    private _wilayaNumber!: WilayaNumber;
    private _email!: Email;
    private _password!: Password;
    private _active!: boolean;
    private _createdAt!: Date;

    constructor(account?: AssociationAccount) {
        if (!account) return;

        this._associationId = account.associationId;
        this._associationName = account.associationName;
        this._wilayaNumber = account.wilayaNumber;
        this._phone = account.phone;
        this._email = account.email;
        this._password = account.password;
        this._active = account.active;
        this._createdAt = account.createdAt;
    }

    withId(id: UserId) {
        this._associationId = id;
        return this;
    }

    withName(name: AssociationName) {
        this._associationName = name;
        return this;
    }

    withWilayaNumber(number: WilayaNumber) {
        this._wilayaNumber = number;
        return this;
    }

    withPhone(phone: PhoneNumber) {
        this._phone = phone;
        return this;
    }

    withEmail(email: Email) {
        this._email = email;
        return this;
    }

    withPassword(password: Password) {
        this._password = password;
        return this;
    }

    withActiveStatus(active: boolean) {
        this._active = active;
        return this;
    }

    withCreatedAt(creationTime: Date) {
        this._createdAt = creationTime;
        return this;
    }

    build() {
        return new AssociationAccount(
            this._associationId,
            this._associationName,
            this._phone,
            this._wilayaNumber,
            this._email,
            this._password,
            this._active,
            this._createdAt,
        );
    }
}

export { AssociationAccountBuilder };
